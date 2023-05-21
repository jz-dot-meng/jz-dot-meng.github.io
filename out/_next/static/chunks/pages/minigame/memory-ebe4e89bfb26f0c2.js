(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
	[843],
	{
		7296: function (e, t, i) {
			(window.__NEXT_P = window.__NEXT_P || []).push([
				"/minigame/memory",
				function () {
					return i(3449);
				},
			]);
		},
		2981: function (e, t, i) {
			"use strict";
			i.d(t, {
				f: function () {
					return f;
				},
			});
			var n,
				l,
				r = i(4788),
				a = i(2796),
				s = i(5893),
				c = i(1309),
				o = i(7294),
				d = function (e) {
					var t = (0, r._)({}, (0, a._)(e)),
						i = t.buttonText,
						n = t.onClick;
					return (0, s.jsx)("button", {
						className: "flex-1 p-1 rounded-md cursor-pointer text-white bg-grey-600",
						onClick: n,
						children: i,
					});
				},
				m = function (e) {
					var t = (0, r._)({}, (0, a._)(e)),
						i = t.state,
						n = t.controls,
						l = (0, c._)((0, o.useState)([]), 2),
						m = l[0],
						u = l[1];
					(0, o.useEffect)(
						function () {
							switch (i) {
								case "Initial":
									u(n.Initial);
									break;
								case "PlayGame":
									u(n.PlayGame), window.addEventListener("keyup", f, !0);
									break;
								case "GameOver":
									u(n.GameOver), window.removeEventListener("keyup", f, !0);
							}
						},
						[i]
					);
					var f = (0, o.useCallback)(function (e) {
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
					return (0, s.jsx)(s.Fragment, {
						children: (0, s.jsx)("div", {
							className: "flex gap-2",
							children:
								null == m
									? void 0
									: m.map(function (e, t) {
											return (0,
											s.jsx)(d, { onClick: e.onClick, buttonText: e.buttonText }, t);
									  }),
						}),
					});
				},
				u = function (e) {
					var t = (0, r._)({}, (0, a._)(e)),
						i = t.state,
						n = t.details,
						l = (0, c._)((0, o.useState)([]), 2),
						d = l[0],
						m = l[1];
					return (
						(0, o.useEffect)(
							function () {
								switch (i) {
									case "Initial":
										m(n.Initial);
										break;
									case "PlayGame":
										m(n.PlayGame);
										break;
									case "GameOver":
										m(n.GameOver);
								}
							},
							[i, n]
						),
						(0, s.jsx)(s.Fragment, {
							children: (0, s.jsx)("div", {
								className: "flex",
								children:
									null == d
										? void 0
										: d.map(function (e, t) {
												return (0,
												s.jsx)("div", { className: "flex flex-1", style: { justifyContent: e.justifyContent }, children: (0, s.jsx)("div", { className: "w-fit", children: e.data }) }, t);
										  }),
							}),
						})
					);
				};
			((n = l || (l = {})).Initial = "Initial"),
				(n.PlayGame = "PlayGame"),
				(n.GameOver = "GameOver");
			var f = function (e) {
				var t = (0, r._)({}, (0, a._)(e)),
					i = t.children,
					n = t.config,
					l = t.state;
				return (0, s.jsxs)("div", {
					className: "w-full flex flex-col gap-2",
					children: [
						(0, s.jsx)("div", {
							children: (0, s.jsx)(u, { state: l, details: n.gameDetails }),
						}),
						(0, s.jsx)("div", {
							className: "min-h-[200px] flex items-center justify-center",
							children: i,
						}),
						(0, s.jsx)("div", {
							children: (0, s.jsx)(m, { state: l, controls: n.gameControls }),
						}),
					],
				});
			};
		},
		1178: function (e, t, i) {
			"use strict";
			i.d(t, {
				p: function () {
					return c;
				},
			});
			var n = i(4788),
				l = i(2796),
				r = i(5893),
				a = i(1664),
				s = i.n(a),
				c = function (e) {
					var t = (0, n._)({}, (0, l._)(e)),
						i = t.linkMap,
						a = t.isInternalLink,
						c = void 0 !== a && a;
					return (0, r.jsx)("ul", {
						className: "list-none",
						children: i.map(function (e, t) {
							return (0,
							r.jsx)("li", { className: "text-lg inline pr-8 text-coral-400 font-bold no-underline", children: c ? (0, r.jsx)(s(), { href: e.url, children: e.name }) : (0, r.jsx)("a", { href: e.url, children: e.name }) }, t);
						}),
					});
				};
		},
		1074: function (e, t, i) {
			"use strict";
			i.d(t, {
				e: function () {
					return n;
				},
			});
			var n = [
				{ url: "/minigame/memory", name: "Memory" },
				{ url: "/minigame/stroop", name: "Stroop Effect" },
			];
		},
		3449: function (e, t, i) {
			"use strict";
			i.r(t),
				i.d(t, {
					MemoryDisplayMode: function () {
						return l;
					},
					default: function () {
						return g;
					},
				});
			var n,
				l,
				r = i(1309),
				a = i(5893),
				s = i(1664),
				c = i.n(s),
				o = i(7294),
				d = i(2981),
				m = i(4788),
				u = i(2796),
				f = i(4586),
				v = function (e) {
					var t = (0, m._)({}, (0, u._)(e)),
						i = t.state,
						n = t.display,
						l = t.grid,
						s = t.levelSelection,
						c = t.handleNextLevel,
						d = t.handleGameOver,
						v = t.preventClick,
						x = (0, r._)((0, o.useState)([]), 2),
						h = x[0],
						p = x[1],
						g = (0, r._)((0, o.useState)([]), 2),
						y = g[0],
						j = g[1];
					(0, o.useEffect)(
						function () {
							for (var e = l[0] * l[1], t = [], i = 0; i < e; i++) t.push(i);
							p(t);
						},
						[l]
					),
						(0, o.useEffect)(
							function () {
								j([]);
							},
							[s]
						);
					var w = function (e) {
							e.forEach(function (e) {
								var t;
								null === (t = document.getElementById("tile-".concat(e))) ||
									void 0 === t ||
									t.classList.remove("memory-correctSelection");
							});
						},
						b = function (e) {
							v(),
								setTimeout(function () {
									w(e),
										setTimeout(function () {
											c();
										}, 500);
								}, 500);
						},
						_ = function (e, t) {
							var i = s.indexOf(e);
							if (-1 === i && -1 === y.indexOf(e)) d();
							else {
								if (
									(t.target.classList.add("memory-correctSelection"),
									-1 !== y.indexOf(e))
								)
									return;
								var n = y.slice();
								n.push.apply(n, (0, f._)(s.splice(i, 1))),
									j(n),
									0 === s.length && b(n);
							}
						};
					return (0, a.jsx)(a.Fragment, {
						children: (0, a.jsx)("div", {
							style: { visibility: "Initial" !== i ? "visible" : "hidden" },
							className: "flex items-center justify-center px-1 rounded-md",
							children: (0, a.jsx)("div", {
								style: {
									borderRadius: "1rem",
									display: "grid",
									gridTemplateColumns: "repeat(".concat(l[0], ", 40px)"),
									gridTemplateRows: "repeat(".concat(l[1], ",40px)"),
								},
								children: h.map(function (e) {
									return (0, a.jsx)(
										"button",
										{
											id: "tile-".concat(e),
											className:
												"appearance-none w-10 h-10 bg-grey-300 border\n                                "
													.concat(
														"Memorise" === n && -1 !== s.indexOf(e)
															? "memory-correctSelection"
															: "",
														" \n                                "
													)
													.concat(
														"GameOver" === n &&
															-1 !== s.indexOf(e) &&
															-1 === y.indexOf(e)
															? "memory-missingSelection"
															: "",
														"\n                                "
													),
											onClick: function (t) {
												return _(e, t);
											},
											disabled: "Guess" !== n,
										},
										e
									);
								}),
							}),
						}),
					});
				},
				x = i(1074),
				h = i(1178);
			((n = l || (l = {})).Memorise = "Memorise"),
				(n.Guess = "Guess"),
				(n.GameOver = "GameOver");
			var p = [
					{ level: 0, dim: [4, 4], tiles: 0 },
					{ level: 1, dim: [4, 4], tiles: 3 },
					{ level: 2, dim: [4, 4], tiles: 4 },
					{ level: 3, dim: [4, 4], tiles: 5 },
					{ level: 4, dim: [4, 4], tiles: 6 },
					{ level: 5, dim: [4, 4], tiles: 7 },
					{ level: 6, dim: [5, 4], tiles: 7 },
					{ level: 7, dim: [5, 4], tiles: 8 },
					{ level: 8, dim: [5, 4], tiles: 9 },
					{ level: 9, dim: [5, 4], tiles: 10 },
					{ level: 10, dim: [5, 4], tiles: 11 },
					{ level: 11, dim: [5, 5], tiles: 11 },
					{ level: 12, dim: [5, 5], tiles: 12 },
					{ level: 13, dim: [5, 5], tiles: 13 },
					{ level: 14, dim: [5, 5], tiles: 14 },
					{ level: 15, dim: [5, 5], tiles: 15 },
					{ level: 16, dim: [6, 5], tiles: 15 },
					{ level: 17, dim: [6, 5], tiles: 16 },
					{ level: 18, dim: [6, 5], tiles: 17 },
					{ level: 19, dim: [6, 5], tiles: 18 },
					{ level: 20, dim: [6, 5], tiles: 19 },
				],
				g = function () {
					var e = (0, r._)((0, o.useState)("Initial"), 2),
						t = e[0],
						i = e[1],
						n = (0, r._)((0, o.useState)("Memorise"), 2),
						l = n[0],
						s = n[1],
						m = (0, r._)((0, o.useState)(0), 2),
						u = m[0],
						f = m[1],
						g = (0, r._)((0, o.useState)([]), 2),
						y = g[0],
						j = g[1],
						w = function (e) {
							for (
								var t = p[e].tiles, i = p[e].dim[0] * p[e].dim[1], n = new Set();
								n.size < t;

							)
								n.add(Math.floor(Math.random() * i));
							j(Array.from(n));
						},
						b = function () {
							for (var e, t = 0; t < 16; t++)
								try {
									null === (e = document.getElementById("tile-".concat(t))) ||
										void 0 === e ||
										e.classList.remove("memory-correctSelection");
								} catch (e) {}
							f(1),
								i("PlayGame"),
								s("Memorise"),
								w(1),
								setTimeout(function () {
									s("Guess");
								}, 1500);
						};
					return (0, a.jsx)("div", {
						className: "flex justify-center items-center h-full p-8",
						children: (0, a.jsxs)("div", {
							className: "flex flex-col gap-4 w-4/5 md:w-1/2",
							children: [
								(0, a.jsxs)("div", {
									className: "flex flex-col gap-4",
									children: [
										(0, a.jsx)("h4", {
											children: (0, a.jsx)(c(), {
												href: "/",
												children: "@jz-dot-meng",
											}),
										}),
										(0, a.jsxs)("div", {
											className:
												"flex items-start flex-col gap-1 md:items-end md:flex-row",
											children: [
												(0, a.jsx)("h1", { children: "memory game" }),
												(0, a.jsx)("span", {
													className: "pb-2",
													children: " :: how far can you get?",
												}),
											],
										}),
										(0, a.jsx)(h.p, { linkMap: x.e, isInternalLink: !0 }),
									],
								}),
								(0, a.jsxs)("div", {
									className: "flex flex-col gap-4",
									children: [
										(0, a.jsx)("p", {
											children:
												"select the tiles shown at the beginning of each level",
										}),
										(0, a.jsx)(d.f, {
											state: t,
											config: {
												gameDetails: {
													Initial: [
														{
															data: "Start the game",
															justifyContent: "flex-start",
														},
													],
													PlayGame: [{ data: "Level ".concat(u) }],
													GameOver: [
														{ data: "Game over: level ".concat(u) },
													],
												},
												gameControls: {
													Initial: [
														{ buttonText: "Start game", onClick: b },
													],
													PlayGame: [],
													GameOver: [
														{ buttonText: "Play again", onClick: b },
													],
												},
											},
											children: (0, a.jsx)(v, {
												state: t,
												display: l,
												grid: p[u].dim,
												levelSelection: y,
												handleNextLevel: function () {
													var e = u + 1;
													f(e),
														s("Memorise"),
														w(e),
														setTimeout(function () {
															s("Guess");
														}, 1500);
												},
												handleGameOver: function () {
													i("GameOver"), s("GameOver");
												},
												preventClick: function () {
													return s("Memorise");
												},
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
		e.O(0, [689, 774, 888, 179], function () {
			return e((e.s = 7296));
		}),
			(_N_E = e.O());
	},
]);
