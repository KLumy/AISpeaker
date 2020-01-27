from . models import KlvBible, BibleBooksKlv
from django.db.models.manager import Manager
from django.db import connections
import re

class Iterator :

    @classmethod
    def fromModel(cls, model_obj) :
        iterator = cls()
        iterator.setModelObject(model_obj)
        return iterator

    def __init__(self) :
        self.cursor = 0
        self.model_obj = None

    def setCursor(self, cursor) :
        self.cursor = cursor
        return self

    def setModelObject(self, model_obj) :
        if isinstance(model_obj, Manager) :
            self.model_obj = model_obj
        else :
            print(type(model_obj))
            raise ValueError('Please inject an instance of django.db.models.manager.Manager')
        return self
    
    #To Do : id가 0에서 부터 생성되는지, 1에서부터 생성되는지 확인할 것
    def hasNext(self) :
        return self.cursor < self.model_obj.count()

    def next(self) :
        next_one = self.model_obj.filter(id=self.cursor)
        self.cursor += 1
        return next_one

class BatchIterator(Iterator) :

    def __init__(self) :
        super(BatchIterator, self).__init__()
        self.batch = 1

    def setBatch(self, batch) :
        self.batch = batch
        return self

    def next(self) :
        first_id = self.cursor
        last_id = self.cursor + self.batch - 1
        next_one = self.model_obj.filter(id__gte=first_id, id__lte=last_id)
        self.cursor = last_id + 1
        return next_one

class BibleReader() :

    __regexs = {
        'book': re.compile(r"(창세기|출애굽기|레위기|민수기|신명기|여호수아|사사기|룻기|사무엘상|사무엘하|열왕기상|열왕기하|역대상|역대하|에스라|느헤미야|에스더|욥기|시편|잠언|전도서|아가|이사야|예레미야|예레미야 애가|에스겔|다니엘|호세아|요엘|아모스|오바댜|요나|미가|나훔|하박국|스바냐|학개|스가랴|말라기|마태복음|마가복음|누가복음|요한복음|사도행전|로마서|고린도전서|고린도후서|갈라디아서|에베소서|빌립보서|골로새서|데살로니가전서|데살로니가후서|디모데전서|디모데후서|디도서|빌레몬서|히브리서|야고보서|베드로전서|베드로후서|요한1서|요한2서|요한3서|유다서|요한계시록)"),
        'chapter': re.compile(r"\d+장"),
        'verse': re.compile(r"\d+절"),
    }
    __seperator = re.compile(r"에서|부터")
    __batch_lines = 4

    def __init__(self) :
        self.bible = BatchIterator.fromModel(KlvBible.objects)

    def _findKeyword(self, regex, query) :
        '''
        정규표현식을 사용하여 사용자 질의에서 중요 키워드(책, 장 절)를 추출해냅니다
        '''
        found = regex.findall(query)
        if len(found) == 1 :
            return found[0]
        else :
            return None

    def _kortitleToBookId(self, kortitle) :
        if kortitle is not None :
            return BibleBooksKlv.objects.get(korean=kortitle).book
        else :
            return None

    def _validateVerboseLabel(self, left, right) :
        '''
        우측 BCV 레이블 중 빈 값들을 유추합니다.
        문맥에 맞추어 left 값을 복사합니다.
        매개변수로 받은 right의 내용물이 변경되니 주의하세요
        '''        
        keys = ['book', 'chapter', 'verse']
        if right is not None :
            for key in keys :
                if right[key] is None :
                    right[key] = left[key]
                else :
                    break

    def _verboseLabelToQuerySet(self, label) :
        '''
        BCV 레이블이 의미하는 바에 맞게 성경 데이터베이스 범위를 한정합니다
        '''
        book = self._kortitleToBookId(label['book'])
        row = KlvBible.objects.filter(book=book)
        if label['chapter'] is not None :
            chapter = label['chapter'][:-1]
            row = row.filter(chapter=chapter)
        if label['verse'] is not None :
            verse = label['verse'][:-1]
            row = row.filter(verse=verse)
        return row
    
    def _querySetToText(self, query_set) :
        strings = [row.data for row in query_set]
        return "".join(strings)

    def _setScopeWithVerboseLabel(self, left, right) :
        self.start = self._verboseLabelToQuerySet(left).first()
        self.end = self._verboseLabelToQuerySet(right).last()
        
    def _verboseLabelToTitle(self, verbose_start, verbose_end) :
        title_form = "{} {}:{}"
        start = title_form.format(verbose_start['book'], self.start.chapter, self.start.verse)
        end = title_form.format(verbose_end['book'], self.end.chapter, self.end.verse)
        return start + "-" + end

    def _makeContents(self) :
        contents = None
        try :
            batch = self.end.id - self.start.id + 1
            if batch < 1 :
                raise Exception
            else :
                query_set = self.bible.setCursor(self.start.id).setBatch(batch).next()
                contents = self._querySetToText(query_set)
        except :
            raise self.BibleScopeError('your designated scope is unacceptable.')
        finally :
            self.bible.setBatch(BibleReader.__batch_lines)
        return contents

    def _makeVerboseLabel(self, query) :
        label = dict()
        for key, regex in BibleReader.__regexs.items() :
            label[key] = self._findKeyword(regex, query)
        return label

    def _splitQuery(self, query) :
        splitted_query = BibleReader.__seperator.split(query)
        if len(splitted_query) < 2 :
            left_query, right_query = query, None
        else :
            left_query, right_query = splitted_query
        return left_query, right_query

    def _queryToVerboseLabel(self, query) :
        left_query, right_query = self._splitQuery(query)
        start, end = None, None
        if left_query is not None :
            start = self._makeVerboseLabel(left_query)
        if right_query is not None :
            end = self._makeVerboseLabel(right_query)
        self._validateVerboseLabel(start, end)
        if end is None :
            end = start
        return start, end

    def search(self, query) :
        '''
        사용자 질의가 요구하는 성경의 범위를 파악하여
        해당하는 성경 텍스트를 반환합니다.
        '''
        verbose_start, verbose_end = self._queryToVerboseLabel(query)
        print(verbose_start, verbose_end)
        self._setScopeWithVerboseLabel(verbose_start, verbose_end)
        contents = self._makeContents()
        title = self._verboseLabelToTitle(verbose_start, verbose_end)
        
        return title, contents
    # To Do : kortitle로 조회가능하도록 자료구조를 바꾸자. 혹은 2자리 영어 book을 kortitle과 매칭하는 테이블을 메모리에 올려두자
    def readMore(self) :
        query_set = self.bible.next()
        contents = self._querySetToText(query_set)
        return contents

    class BibleScopeError(Exception) :
        pass
