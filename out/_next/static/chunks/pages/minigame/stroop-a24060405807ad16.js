(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
	[416],
	{
		3591: function (e, t, r) {
			(window.__NEXT_P = window.__NEXT_P || []).push([
				"/minigame/stroop",
				function () {
					return r(1669);
				},
			]);
		},
		2981: function (e, t, r) {
			"use strict";
			r.d(t, {
				f: function () {
					return m;
				},
			});
			var n,
				a,
				i = r(4788),
				c = r(2796),
				o = r(5893),
				l = r(1309),
				s = r(7294),
				d = function (e) {
					var t = (0, i._)({}, (0, c._)(e)),
						r = t.buttonText,
						n = t.onClick;
					return (0, o.jsx)("button", {
						className: "flex-1 p-1 rounded-md cursor-pointer text-white bg-grey-600",
						onClick: n,
						children: r,
					});
				},
				u = function (e) {
					var t = (0, i._)({}, (0, c._)(e)),
						r = t.state,
						n = t.controls,
						a = (0, l._)((0, s.useState)([]), 2),
						u = a[0],
						f = a[1];
					(0, s.useEffect)(
						function () {
							switch (r) {
								case "Initial":
									f(n.Initial);
									break;
								case "PlayGame":
									f(n.PlayGame), window.addEventListener("keyup", m, !0);
									break;
								case "GameOver":
									f(n.GameOver), window.removeEventListener("keyup", m, !0);
							}
						},
						[r]
					);
					var m = (0, s.useCallback)(function (e) {
						switch (e.code) {
							case "ArrowLeft":
								void 0 !== n.bindLeftArrow && n.bindLeftArrow();
								break;
							case "ArrowRight":
								void 0 !== n.bindRightArrow && n.bindRightArrow();
								break;
							case "ArrowUp":
								void 0 !== n.bindUpArrow &&
									(n.bindUpArrow(), console.log("arrow up"));
								break;
							case "ArrowDown":
								void 0 !== n.bindDownArrow && n.bindDownArrow();
						}
					}, []);
					return (0, o.jsx)(o.Fragment, {
						children: (0, o.jsx)("div", {
							className: "flex gap-2",
							children:
								null == u
									? void 0
									: u.map(function (e, t) {
											return (0,
											o.jsx)(d, { onClick: e.onClick, buttonText: e.buttonText }, t);
									  }),
						}),
					});
				},
				f = function (e) {
					var t = (0, i._)({}, (0, c._)(e)),
						r = t.state,
						n = t.details,
						a = (0, l._)((0, s.useState)([]), 2),
						d = a[0],
						u = a[1];
					return (
						(0, s.useEffect)(
							function () {
								switch (r) {
									case "Initial":
										u(n.Initial);
										break;
									case "PlayGame":
										u(n.PlayGame);
										break;
									case "GameOver":
										u(n.GameOver);
								}
							},
							[r, n]
						),
						(0, o.jsx)(o.Fragment, {
							children: (0, o.jsx)("div", {
								className: "flex",
								children:
									null == d
										? void 0
										: d.map(function (e, t) {
												return (0,
												o.jsx)("div", { className: "flex flex-1", style: { justifyContent: e.justifyContent }, children: (0, o.jsx)("div", { className: "w-fit", children: e.data }) }, t);
										  }),
							}),
						})
					);
				};
			((n = a || (a = {})).Initial = "Initial"),
				(n.PlayGame = "PlayGame"),
				(n.GameOver = "GameOver");
			var m = function (e) {
				var t = (0, i._)({}, (0, c._)(e)),
					r = t.children,
					n = t.config,
					a = t.state;
				return (0, o.jsxs)("div", {
					className: "w-full flex flex-col gap-2",
					children: [
						(0, o.jsx)("div", {
							children: (0, o.jsx)(f, { state: a, details: n.gameDetails }),
						}),
						(0, o.jsx)("div", {
							className: "min-h-[200px] flex items-center justify-center",
							children: r,
						}),
						(0, o.jsx)("div", {
							children: (0, o.jsx)(u, { state: a, controls: n.gameControls }),
						}),
					],
				});
			};
		},
		1178: function (e, t, r) {
			"use strict";
			r.d(t, {
				p: function () {
					return l;
				},
			});
			var n = r(4788),
				a = r(2796),
				i = r(5893),
				c = r(1664),
				o = r.n(c),
				l = function (e) {
					var t = (0, n._)({}, (0, a._)(e)),
						r = t.linkMap,
						c = t.isInternalLink,
						l = void 0 !== c && c;
					return (0, i.jsx)("ul", {
						className: "list-none",
						children: r.map(function (e, t) {
							return (0,
							i.jsx)("li", { className: "text-lg inline pr-8 text-coral-400 font-bold no-underline", children: l ? (0, i.jsx)(o(), { href: e.url, children: e.name }) : (0, i.jsx)("a", { href: e.url, children: e.name }) }, t);
						}),
					});
				};
		},
		1074: function (e, t, r) {
			"use strict";
			r.d(t, {
				e: function () {
					return n;
				},
			});
			var n = [
				{ url: "/minigame/memory", name: "Memory" },
				{ url: "/minigame/stroop", name: "Stroop Effect" },
			];
		},
		1669: function (e, t, r) {
			"use strict";
			r.r(t),
				r.d(t, {
					default: function () {
						return p;
					},
				});
			var n,
				a,
				i = r(1309),
				c = r(5893),
				o = r(1664),
				l = r.n(o),
				s = r(7294),
				d = r(2981),
				u = r(4788),
				f = r(2796),
				m = function (e) {
					var t = (0, u._)({}, (0, f._)(e)),
						r = t.cardTitle,
						n = t.cardTitleStyle,
						a = t.cardSubTitle,
						i = t.cardSubTitleStyle;
					return (0, c.jsx)(c.Fragment, {
						children: (0, c.jsxs)("div", {
							className:
								"flex items-center justify-center flex-col border rounded-md py-8 px-20 w-4/5 md:w-2/5",
							children: [
								(0, c.jsx)("div", { className: "px-1", style: i, children: a }),
								(0, c.jsx)("div", {
									className: "px-1 text-4xl",
									style: n,
									children: r,
								}),
							],
						}),
					});
				},
				x = function (e) {
					var t = (0, u._)({}, (0, f._)(e)),
						r = t.state,
						n = t.card1,
						a = t.card2;
					return (0, c.jsx)(c.Fragment, {
						children: (0, c.jsxs)("div", {
							style: { visibility: "PlayGame" === r ? "visible" : "hidden" },
							className:
								"flex justify-center items-center gap-2 px-1 md:px-2 flex-col md:flex-row",
							children: [
								(0, c.jsx)(m, {
									cardTitle: null == n ? void 0 : n.cardWord,
									cardSubTitle: null == n ? void 0 : n.cardType,
									cardTitleStyle: null == n ? void 0 : n.wordStyle,
								}),
								(0, c.jsx)(m, {
									cardTitle: null == a ? void 0 : a.cardWord,
									cardSubTitle: null == a ? void 0 : a.cardType,
									cardTitleStyle: null == a ? void 0 : a.wordStyle,
								}),
							],
						}),
					});
				},
				h = r(1074),
				v = r(1178),
				b = r(1957),
				w = r(4235),
				g = r(5037),
				y = function (e, t) {
					var r = (0, i._)((0, s.useState)(t), 2),
						n = r[0],
						a = r[1],
						c = (0, s.useRef)();
					return (
						(0, s.useEffect)(
							function () {
								null === (t = c.current) || void 0 === t || t.unsubscribe();
								var t,
									r = null == e ? void 0 : e.subscribe(a);
								return (
									(c.current = r),
									function () {
										var e;
										return null === (e = c.current) || void 0 === e
											? void 0
											: e.unsubscribe();
									}
								);
							},
							[e]
						),
						n
					);
				};
			((n = a || (a = {})).match = "match"), (n.noMatch = "noMatch"), (n.reset = "reset");
			var j = [
					{ word: "red", rgba: "rgba(255,0,0,0.9)" },
					{ word: "blue", rgba: "rgba(0,0,255,0.9)" },
					{ word: "green", rgba: "rgba(0,255,0,0.8)" },
					{ word: "cyan", rgba: "rgba(0,255,255,0.8)" },
					{ word: "purple", rgba: "rgba(204,0,255,1)" },
					{ word: "yellow", rgba: "rgba(245,245,0,0.9)" },
					{ word: "orange", rgba: "rgba(255,153,51,0.9)" },
				],
				p = function () {
					var e = function () {
							z("match"),
								setTimeout(function () {
									return z(function (e) {
										return "reset";
									});
								}, 10);
						},
						t = function () {
							z("noMatch"),
								setTimeout(function () {
									return z(function (e) {
										return "reset";
									});
								}, 10);
						},
						r = (0, i._)((0, s.useState)("Initial"), 2),
						n = r[0],
						a = r[1],
						o = (0, s.useRef)(new b.X(0)),
						u = y(o.current, 0),
						f = (0, i._)((0, s.useState)(), 2),
						m = f[0],
						p = f[1],
						_ = (0, i._)((0, s.useState)(0), 2),
						S = _[0],
						T = _[1],
						k = (0, i._)((0, s.useState)(void 0), 2),
						N = k[0],
						G = k[1],
						C = (0, i._)((0, s.useState)(void 0), 2),
						M = C[0],
						A = C[1],
						P = (0, i._)((0, s.useState)(0), 2),
						E = P[0],
						O = P[1],
						I = (0, i._)((0, s.useState)(0), 2),
						L = I[0],
						R = I[1],
						W = function () {
							var e,
								t = Math.floor(Math.random() * (j.length - 0.1));
							O(t),
								0.4 > Math.random()
									? ((e = t), R(t))
									: R((e = Math.floor(Math.random() * (j.length - 0.1))));
							var r = Math.floor(Math.random() * (j.length - 0.1));
							0.5 > Math.random()
								? (G({
										cardWord: j[t].word,
										cardType: "meaning",
										wordStyle: { color: "#ffffff" },
								  }),
								  A({
										cardWord: j[r].word,
										cardType: "colour",
										wordStyle: { color: j[e].rgba },
								  }))
								: (G({
										cardWord: j[r].word,
										cardType: "colour",
										wordStyle: { color: j[e].rgba },
								  }),
								  A({
										cardWord: j[t].word,
										cardType: "meaning",
										cardStyle: { color: "#ffffff" },
								  }));
						},
						D = function () {
							o.current.next(45), T(0), W(), a("PlayGame");
						};
					(0, s.useEffect)(
						function () {
							switch (n) {
								case "GameOver":
									null == m || m.unsubscribe();
									break;
								case "PlayGame":
									var e = (0, w.H)(0, 100)
										.pipe(
											(0, g.o)(function () {
												return o.current.getValue() > 0;
											})
										)
										.subscribe(function (e) {
											o.current.next(45 - 0.1 * e);
										});
									e.add(function () {
										return a("GameOver");
									}),
										p(e);
							}
						},
						[n]
					);
					var F = function () {
							o.current.next(0), a("GameOver"), z("reset");
						},
						U = (0, i._)((0, s.useState)("reset"), 2),
						X = U[0],
						z = U[1];
					(0, s.useEffect)(
						function () {
							switch (X) {
								case "match":
									E === L
										? (T(function (e) {
												return e + 1;
										  }),
										  W())
										: F();
									break;
								case "noMatch":
									E !== L
										? (T(function (e) {
												return e + 1;
										  }),
										  W())
										: F();
							}
						},
						[X]
					);
					var H = {
						gameDetails: {
							Initial: [
								{ data: "Timer: 0", justifyContent: "flex-start" },
								{ data: "Score: 0", justifyContent: "flex-end" },
							],
							PlayGame: [
								{
									data: "Timer: ".concat(u.toFixed(3)),
									justifyContent: "flex-start",
								},
								{ data: "Score: ".concat(S), justifyContent: "flex-end" },
							],
							GameOver: [
								{ data: "Game over!", justifyContent: "flex-start" },
								{ data: "Score: ".concat(S), justifyContent: "flex-end" },
							],
						},
						gameControls: {
							Initial: [{ buttonText: "Start game", onClick: D }],
							PlayGame: [
								{ buttonText: "< no match", onClick: t },
								{ buttonText: "match >", onClick: e },
							],
							GameOver: [{ buttonText: "Play again", onClick: D }],
							bindLeftArrow: t,
							bindRightArrow: e,
						},
					};
					return (0, c.jsx)("div", {
						className: "flex justify-center items-center h-full p-8",
						children: (0, c.jsxs)("div", {
							className: "flex flex-col gap-4  w-4/5 md:w-1/2",
							children: [
								(0, c.jsxs)("div", {
									className: "flex flex-col gap-4",
									children: [
										(0, c.jsx)("h4", {
											children: (0, c.jsx)(l(), {
												href: "/",
												children: "@jz-dot-meng",
											}),
										}),
										(0, c.jsxs)("div", {
											className:
												"flex items-start flex-col gap-1 md:items-end md:flex-row",
											children: [
												(0, c.jsx)("h1", { children: "stroop effect" }),
												(0, c.jsx)("span", {
													className: "pb-2",
													children:
														":: reaction delay between congruent and incongruent stimuli",
												}),
											],
										}),
										(0, c.jsx)(v.p, { linkMap: h.e, isInternalLink: !0 }),
									],
								}),
								(0, c.jsxs)("div", {
									className: "flex flex-col gap-4",
									children: [
										(0, c.jsx)("p", {
											children:
												"match the text of the 'meaning' word to the colour of the 'colour' word",
										}),
										(0, c.jsx)(d.f, {
											state: n,
											config: H,
											children: (0, c.jsx)(x, {
												state: n,
												card1: N,
												card2: M,
											}),
										}),
									],
								}),
							],
						}),
					});
				};
		},
	},
	function (e) {
		e.O(0, [689, 951, 774, 888, 179], function () {
			return e((e.s = 3591));
		}),
			(_N_E = e.O());
	},
]);
