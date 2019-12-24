! function (t, i) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = i() : "function" == typeof define && define.amd ? define(i) : t.SiriWave = i()
}(this, function () {
    "use strict";

    function d(t, i) {
        if (!(t instanceof i)) throw new TypeError("Cannot call a class as a function")
    }

    function n(t, i) {
        for (var e = 0; e < i.length; e++) {
            var n = i[e];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }

    function t(t, i, e) {
        return i && n(t.prototype, i), e && n(t, e), t
    }
    var i = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
    for (var e, s = (function (r) {
            (function () {
                var t, i, e, n, s, a;
                "undefined" != typeof performance && null !== performance && performance.now ? r.exports = function () {
                    return performance.now()
                } : "undefined" != typeof process && null !== process && process.hrtime ? (r.exports = function () {
                    return (t() - s) / 1e6
                }, i = process.hrtime, n = (t = function () {
                    var t;
                    return 1e9 * (t = i())[0] + t[1]
                })(), a = 1e9 * process.uptime(), s = n - a) : e = Date.now ? (r.exports = function () {
                    return Date.now() - e
                }, Date.now()) : (r.exports = function () {
                    return (new Date).getTime() - e
                }, (new Date).getTime())
            }).call(i)
        }(e = {
            exports: {}
        }, e.exports), e.exports), a = "undefined" == typeof window ? i : window, r = ["moz", "webkit"], o = "AnimationFrame", h = a["request" + o], l = a["cancel" + o] || a["cancelRequest" + o], u = 0; !h && u < r.length; u++) h = a[r[u] + "Request" + o], l = a[r[u] + "Cancel" + o] || a[r[u] + "CancelRequest" + o];
    if (!h || !l) {
        var c = 0,
            p = 0,
            f = [];
        h = function (t) {
            if (0 === f.length) {
                var i = s(),
                    e = Math.max(0, 1e3 / 60 - (i - c));
                c = e + i, setTimeout(function () {
                    for (var t = f.slice(0), i = f.length = 0; i < t.length; i++)
                        if (!t[i].cancelled) try {
                            t[i].callback(c)
                        } catch (t) {
                            setTimeout(function () {
                                throw t
                            }, 0)
                        }
                }, Math.round(e))
            }
            return f.push({
                handle: ++p,
                callback: t,
                cancelled: !1
            }), p
        }, l = function (t) {
            for (var i = 0; i < f.length; i++) f[i].handle === t && (f[i].cancelled = !0)
        }
    }
    var v = function (t) {
        return h.call(a, t)
    };
    v.cancel = function () {
        l.apply(a, arguments)
    }, v.polyfill = function (t) {
        t || (t = a), t.requestAnimationFrame = h, t.cancelAnimationFrame = l
    };
    var y = function (t, i, e) {
            return t * (1 - e) + i * e
        },
        A = function () {
            function i(t) {
                d(this, i), this.ctrl = t.ctrl, this.definition = t.definition, this.ATT_FACTOR = 4, this.GRAPH_X = 2, this.AMPLITUDE_FACTOR = .6
            }
            return t(i, [{
                key: "globalAttFn",
                value: function (t) {
                    return Math.pow(this.ATT_FACTOR / (this.ATT_FACTOR + Math.pow(t, this.ATT_FACTOR)), this.ATT_FACTOR)
                }
            }, {
                key: "_xpos",
                value: function (t) {
                    return this.ctrl.width * ((t + this.GRAPH_X) / (2 * this.GRAPH_X))
                }
            }, {
                key: "_ypos",
                value: function (t) {
                    return this.AMPLITUDE_FACTOR * (this.globalAttFn(t) * (this.ctrl.heightMax * this.ctrl.amplitude) * (1 / this.definition.attenuation) * Math.sin(this.ctrl.opt.frequency * t - this.ctrl.phase))
                }
            }, {
                key: "draw",
                value: function () {
                    var t = this.ctrl.ctx;
                    t.moveTo(0, 0), t.beginPath();
                    var i = this.ctrl.color.replace(/rgb\(/g, "").replace(/\)/g, "");
                    t.strokeStyle = "rgba(".concat(i, ",").concat(this.definition.opacity, ")"), t.lineWidth = this.definition.lineWidth;
                    for (var e = -this.GRAPH_X; e <= this.GRAPH_X; e += this.ctrl.opt.pixelDepth) t.lineTo(this._xpos(e), this.ctrl.heightMax + this._ypos(e));
                    t.stroke()
                }
            }], [{
                key: "getDefinition",
                value: function () {
                    return [{
                        attenuation: -2,
                        lineWidth: 1,
                        opacity: .1
                    }, {
                        attenuation: -6,
                        lineWidth: 1,
                        opacity: .2
                    }, {
                        attenuation: 4,
                        lineWidth: 1,
                        opacity: .4
                    }, {
                        attenuation: 2,
                        lineWidth: 1,
                        opacity: .6
                    }, {
                        attenuation: 1,
                        lineWidth: 1.5,
                        opacity: 1
                    }]
                }
            }]), i
        }(),
        g = function () {
            function i() {
                var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
                d(this, i), this.ctrl = t.ctrl, this.definition = t.definition, this.GRAPH_X = 25, this.AMPLITUDE_FACTOR = .8, this.SPEED_FACTOR = 1, this.DEAD_PX = 2, this.ATT_FACTOR = 4, this.DESPAWN_FACTOR = .02, this.NOOFCURVES_RANGES = [2, 5], this.AMPLITUDE_RANGES = [.3, 1], this.OFFSET_RANGES = [-3, 3], this.WIDTH_RANGES = [1, 3], this.SPEED_RANGES = [.5, 1], this.DESPAWN_TIMEOUT_RANGES = [500, 2e3], this.respawn()
            }
            return t(i, [{
                key: "getRandomRange",
                value: function (t) {
                    return t[0] + Math.random() * (t[1] - t[0])
                }
            }, {
                key: "respawnSingle",
                value: function (t) {
                    this.phases[t] = 0, this.amplitudes[t] = 0, this.despawnTimeouts[t] = this.getRandomRange(this.DESPAWN_TIMEOUT_RANGES), this.offsets[t] = this.getRandomRange(this.OFFSET_RANGES), this.speeds[t] = this.getRandomRange(this.SPEED_RANGES), this.finalAmplitudes[t] = this.getRandomRange(this.AMPLITUDE_RANGES), this.widths[t] = this.getRandomRange(this.WIDTH_RANGES), this.verses[t] = this.getRandomRange([-1, 1])
                }
            }, {
                key: "respawn",
                value: function () {
                    this.spawnAt = Date.now(), this.noOfCurves = Math.floor(this.getRandomRange(this.NOOFCURVES_RANGES)), this.phases = new Array(this.noOfCurves), this.offsets = new Array(this.noOfCurves), this.speeds = new Array(this.noOfCurves), this.finalAmplitudes = new Array(this.noOfCurves), this.widths = new Array(this.noOfCurves), this.amplitudes = new Array(this.noOfCurves), this.despawnTimeouts = new Array(this.noOfCurves), this.verses = new Array(this.noOfCurves);
                    for (var t = 0; t < this.noOfCurves; t++) this.respawnSingle(t)
                }
            }, {
                key: "globalAttFn",
                value: function (t) {
                    return Math.pow(this.ATT_FACTOR / (this.ATT_FACTOR + Math.pow(t, 2)), this.ATT_FACTOR)
                }
            }, {
                key: "sin",
                value: function (t, i) {
                    return Math.sin(t - i)
                }
            }, {
                key: "_grad",
                value: function (t, i, e) {
                    return 1
                }
            }, {
                key: "yRelativePos",
                value: function (t) {
                    for (var i = 0, e = 0; e < this.noOfCurves; e++) {
                        var n = 4 * (e / (this.noOfCurves - 1) * 2 - 1);
                        n += this.offsets[e];
                        var s = t * (1 / this.widths[e]) - n;
                        i += Math.abs(this.amplitudes[e] * this.sin(this.verses[e] * s, this.phases[e]) * this.globalAttFn(s))
                    }
                    return i / this.noOfCurves
                }
            }, {
                key: "_ypos",
                value: function (t) {
                    return this.AMPLITUDE_FACTOR * this.ctrl.heightMax * this.ctrl.amplitude * this.yRelativePos(t) * this.globalAttFn(t / this.GRAPH_X * 2)
                }
            }, {
                key: "_xpos",
                value: function (t) {
                    return this.ctrl.width * ((t + this.GRAPH_X) / (2 * this.GRAPH_X))
                }
            }, {
                key: "drawSupportLine",
                value: function (t) {
                    var i = [0, this.ctrl.heightMax, this.ctrl.width, 1],
                        e = t.createLinearGradient.apply(t, i);
                    e.addColorStop(0, "transparent"), e.addColorStop(.1, "rgba(255,255,255,.5)"), e.addColorStop(.8, "rgba(255,255,255,.5)"), e.addColorStop(1, "transparent"), t.fillStyle = e, t.fillRect.apply(t, i)
                }
            }, {
                key: "draw",
                value: function () {
                    var t = this.ctrl.ctx;
                    if (t.globalAlpha = .7, t.globalCompositeOperation = "lighter", this.definition.supportLine) return this.drawSupportLine(t);
                    for (var i = 0; i < this.noOfCurves; i++) this.spawnAt + this.despawnTimeouts[i] <= Date.now() ? this.amplitudes[i] -= this.DESPAWN_FACTOR : this.amplitudes[i] += this.DESPAWN_FACTOR, this.amplitudes[i] = Math.min(Math.max(this.amplitudes[i], 0), this.finalAmplitudes[i]), this.phases[i] = (this.phases[i] + this.ctrl.speed * this.speeds[i] * this.SPEED_FACTOR) % (2 * Math.PI);
                    for (var e = -1 / 0, n = [1, -1], s = 0; s < n.length; s++) {
                        var a = n[s];
                        t.beginPath();
                        for (var r = -this.GRAPH_X; r <= this.GRAPH_X; r += this.ctrl.opt.pixelDepth) {
                            var o = this._xpos(r),
                                h = this._ypos(r);
                            t.lineTo(o, this.ctrl.heightMax - a * h), e = Math.max(e, h)
                        }
                        t.closePath(), t.fillStyle = "rgba(".concat(this.definition.color, ", 1)"), t.strokeStyle = "rgba(".concat(this.definition.color, ", 1)"), t.fill()
                    }
                    return e < this.DEAD_PX && this.prevMaxY > e && this.respawn(), this.prevMaxY = e, null
                }
            }], [{
                key: "getDefinition",
                value: function (t) {
                    return Object.assign([{
                        color: "255,255,255",
                        supportLine: !0
                    }, {
                        color: "15, 82, 169"
                    }, {
                        color: "173, 57, 76"
                    }, {
                        color: "48, 220, 155"
                    }], t)
                }
            }]), i
        }();
    return function () {
        function f() {
            var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
            if (d(this, f), this.container = t.container || document.body, this.opt = Object.assign({
                    style: "ios",
                    ratio: window.devicePixelRatio || 1,
                    speed: .2,
                    amplitude: 1,
                    frequency: 6,
                    color: "#fff",
                    cover: !1,
                    width: window.getComputedStyle(this.container).width.replace("px", ""),
                    height: window.getComputedStyle(this.container).height.replace("px", ""),
                    autostart: !1,
                    pixelDepth: .02,
                    lerpSpeed: .1
                }, t), this.phase = 0, this.run = !1, this.speed = Number(this.opt.speed), this.amplitude = Number(this.opt.amplitude), this.width = Number(this.opt.ratio * this.opt.width), this.height = Number(this.opt.ratio * this.opt.height), this.heightMax = Number(this.height / 2) - 6, this.color = "rgb(".concat(this.hex2rgb(this.opt.color), ")"), this.interpolation = {
                    speed: this.speed,
                    amplitude: this.amplitude
                }, this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), this.canvas.width = this.width, this.canvas.height = this.height, !0 === this.opt.cover ? this.canvas.style.width = this.canvas.style.height = "100%" : (this.canvas.style.width = "".concat(this.width / this.opt.ratio, "px"), this.canvas.style.height = "".concat(this.height / this.opt.ratio, "px")), this.curves = [], "ios9" === this.opt.style) {
                var i = !0,
                    e = !1,
                    n = void 0;
                try {
                    for (var s, a = g.getDefinition(this.opt.waveColors || [])[Symbol.iterator](); !(i = (s = a.next()).done); i = !0) {
                        var r = s.value;
                        this.curves.push(new g({
                            ctrl: this,
                            definition: r
                        }))
                    }
                } catch (t) {
                    e = !0, n = t
                } finally {
                    try {
                        i || null == a.return || a.return()
                    } finally {
                        if (e) throw n
                    }
                }
            } else {
                var o = !0,
                    h = !1,
                    l = void 0;
                try {
                    for (var u, c = A.getDefinition()[Symbol.iterator](); !(o = (u = c.next()).done); o = !0) {
                        var p = u.value;
                        this.curves.push(new A({
                            ctrl: this,
                            definition: p
                        }))
                    }
                } catch (t) {
                    h = !0, l = t
                } finally {
                    try {
                        o || null == c.return || c.return()
                    } finally {
                        if (h) throw l
                    }
                }
            }
            this.container.appendChild(this.canvas), t.autostart && this.start()
        }
        return t(f, [{
            key: "hex2rgb",
            value: function (t) {
                t = t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (t, i, e, n) {
                    return i + i + e + e + n + n
                });
                var i = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
                return i ? "".concat(parseInt(i[1], 16).toString(), ",").concat(parseInt(i[2], 16).toString(), ",").concat(parseInt(i[3], 16).toString()) : null
            }
        }, {
            key: "lerp",
            value: function (t) {
                return this[t] = y(this[t], this.interpolation[t], this.opt.lerpSpeed), this[t] - this.interpolation[t] == 0 && (this.interpolation[t] = null), this[t]
            }
        }, {
            key: "_clear",
            value: function () {
                this.ctx.globalCompositeOperation = "destination-out", this.ctx.fillRect(0, 0, this.width, this.height), this.ctx.globalCompositeOperation = "source-over"
            }
        }, {
            key: "_draw",
            value: function () {
                var t = !0,
                    i = !1,
                    e = void 0;
                try {
                    for (var n, s = this.curves[Symbol.iterator](); !(t = (n = s.next()).done); t = !0) {
                        n.value.draw()
                    }
                } catch (t) {
                    i = !0, e = t
                } finally {
                    try {
                        t || null == s.return || s.return()
                    } finally {
                        if (i) throw e
                    }
                }
            }
        }, {
            key: "startDrawCycle",
            value: function () {
                !1 !== this.run && (this._clear(), null !== this.interpolation.amplitude && this.lerp("amplitude"), null !== this.interpolation.speed && this.lerp("speed"), this._draw(), this.phase = (this.phase + Math.PI / 2 * this.speed) % (2 * Math.PI), v(this.startDrawCycle.bind(this)))
            }
        }, {
            key: "start",
            value: function () {
                this.phase = 0, this.run = !0, this.startDrawCycle()
            }
        }, {
            key: "stop",
            value: function () {
                this.phase = 0, this.run = !1
            }
        }, {
            key: "set",
            value: function (t, i) {
                this.interpolation[t] = Number(i)
            }
        }, {
            key: "setSpeed",
            value: function (t) {
                this.set("speed", t)
            }
        }, {
            key: "setAmplitude",
            value: function (t) {
                this.set("amplitude", t)
            }
        }]), f
    }()
});