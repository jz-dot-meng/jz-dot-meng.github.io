(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
	[405],
	{
		8312: function (t, e, n) {
			(window.__NEXT_P = window.__NEXT_P || []).push([
				"/",
				function () {
					return n(810);
				},
			]);
		},
		1178: function (t, e, n) {
			"use strict";
			n.d(e, {
				p: function () {
					return c;
				},
			});
			var r = n(4788),
				i = n(2796),
				s = n(5893),
				o = n(1664),
				a = n.n(o),
				c = function (t) {
					var e = (0, r._)({}, (0, i._)(t)),
						n = e.linkMap,
						o = e.isInternalLink,
						c = void 0 !== o && o;
					return (0, s.jsx)("ul", {
						className: "list-none",
						children: n.map(function (t, e) {
							return (0,
							s.jsx)("li", { className: "text-lg inline pr-8 text-coral-400 font-bold no-underline", children: c ? (0, s.jsx)(a(), { href: t.url, children: t.name }) : (0, s.jsx)("a", { href: t.url, children: t.name }) }, e);
						}),
					});
				};
		},
		810: function (t, e, n) {
			"use strict";
			n.r(e),
				n.d(e, {
					default: function () {
						return M;
					},
				});
			var r = n(1010),
				i = n(1309),
				s = n(655),
				o = n(5893),
				a = n(7294),
				c = n(1664),
				h = n.n(c),
				u = n(8564),
				l = n(4788),
				f = n(2796),
				d = function (t) {
					var e = function (t) {
							for (
								var e = [], n = Math.floor((t.height * t.width) / 9e3), r = 0;
								r < n;
								r++
							) {
								var i = Math.random() * (t.width - 2.5 - 2.5) + 2.5,
									s = Math.random() * (t.height - 2.5 - 2.5) + 2.5,
									o = 3 * Math.random() - 1.5,
									a = 3 * Math.random() - 1.5;
								e.push(new m(i, s, o, a, 1.25, "#bcbcbc"));
							}
							h(e);
						},
						n = function (t, e) {
							for (var n = 0; n < c.length - 1; n++)
								for (var r = n; r < c.length; r++)
									(c[n].x - c[r].x) * (c[n].x - c[r].x) +
										(c[n].y - c[r].y) * (c[n].y - c[r].y) <
										(t.width / 10) * (t.height / 10) &&
										((e.strokeStyle = "rgba(255,204,204,1)"),
										(e.lineWidth = 1),
										e.beginPath(),
										e.moveTo(c[n].x, c[n].y),
										e.lineTo(c[r].x, c[r].y),
										e.stroke());
						};
					(0, l._)({}, (0, f._)(t));
					var r = (0, a.useRef)(null),
						s = (0, i._)((0, a.useState)([]), 2),
						c = s[0],
						h = s[1];
					return (
						(0, a.useEffect)(function () {
							if (r.current) {
								var t = r.current;
								(t.style.width = "100%"),
									(t.style.height = "100%"),
									(t.width = t.offsetWidth),
									(t.height = t.offsetHeight),
									e(t);
							} else console.warn("no canvas for rendering");
						}, []),
						(0, a.useEffect)(function () {
							window.addEventListener("resize", function () {
								if (r.current) {
									var t = r.current;
									(t.style.width = "100%"),
										(t.style.height = "100%"),
										(t.width = t.offsetWidth),
										(t.height = t.offsetHeight),
										e(t);
								} else console.warn("no canvas for rendering");
							});
						}, []),
						(0, a.useEffect)(
							function () {
								(function t() {
									if ((requestAnimationFrame(t), r.current)) {
										var e = r.current,
											i = e.getContext("2d");
										if (i) {
											i.clearRect(0, 0, e.width, e.height);
											for (
												var s = 0;
												s < (null == c ? void 0 : c.length);
												s++
											)
												c[s].update(e, i);
											n(e, i);
										}
									}
								})();
							},
							[c]
						),
						(0, o.jsx)("canvas", { ref: r })
					);
				},
				m = (function () {
					function t(e, n, r, i, s, o) {
						(0, u._)(this, t),
							(this.x = e),
							(this.y = n),
							(this.directionX = r),
							(this.directionY = i),
							(this.size = s),
							(this.color = o);
					}
					var e = t.prototype;
					return (
						(e.draw = function (t) {
							t.beginPath(),
								t.arc(this.x, this.y, this.size, 0, 2 * Math.PI, !1),
								(t.fillStyle = this.color),
								t.fill();
						}),
						(e.update = function (t, e) {
							(this.x > t.width || this.x < 0) &&
								(this.directionX = -this.directionX),
								(this.y > t.height || this.y < 0) &&
									(this.directionY = -this.directionY),
								(this.x += this.directionX),
								(this.y += this.directionY),
								this.draw(e);
						}),
						t
					);
				})(),
				g = n(3673),
				x = n.n(g),
				v = function (t) {
					var e = (0, l._)({}, (0, f._)(t)),
						n = e.textLength,
						r = e.href,
						s = (0, a.useRef)(null),
						c = (0, i._)((0, a.useState)(null), 2),
						h = c[0],
						u = c[1];
					return (
						(0, a.useEffect)(function () {
							var t = "a".repeat(n);
							u({ "--textContent": '"'.concat(t, '"') });
						}, []),
						(0, o.jsx)("a", {
							href: r,
							children: (0, o.jsx)("div", {
								ref: s,
								className: x().skeleton,
								style: h,
							}),
						})
					);
				},
				p = function (t) {
					var e = function (t) {
							(t.style.width = "100%"),
								(t.style.height = "100%"),
								(t.width = t.offsetWidth),
								(t.height = t.offsetHeight);
							var e = t.getContext("2d");
							e &&
								(e.clearRect(0, 0, t.width, t.height),
								(e.fillStyle = "rgba(255,255,255,0.8)"),
								e.fillRect(0, 0, t.width, t.height));
						},
						n = function (t, e) {
							e.clearRect(0, 0, t.width, t.height),
								(e.fillStyle = "rgba(255,255,255,0.8)");
							var n = t.width / 2,
								i = t.height / 2;
							(M.current = r(0)), (_.current = r(1)), (y.current = r(2));
							for (var o = 0; o < h; o++) {
								var a = n,
									c = i;
								(n = Math.sin(x.current * c) + p.current * Math.cos(x.current * a)),
									(i =
										Math.sin(v.current * a) +
										j.current * Math.cos(v.current * c)),
									s((t.width * (n + 3)) / 6, (t.height * (i + 3)) / 6, e);
							}
						},
						r = function (t) {
							return (
								128 + 128 * Math.sin(d[t] * m.current + (2 * w[t] * Math.PI) / 255)
							);
						},
						i = function (t) {
							return (
								1.5 + 1.5 * Math.sin(u[t] * m.current + (2 * g[t] * Math.PI) / 6)
							);
						},
						s = function (t, e, n) {
							(n.fillStyle =
								"rgba(" +
								Math.ceil(M.current) +
								"," +
								Math.ceil(_.current) +
								"," +
								Math.ceil(y.current) +
								",1)"),
								n.beginPath(),
								n.arc(t, e, 0.5, 0, 2 * Math.PI),
								n.closePath(),
								n.fill();
						};
					(0, l._)({}, (0, f._)(t));
					var c = (0, a.useRef)(null),
						h = 18e3,
						u = [
							Math.random() / (200 * Math.random()),
							Math.random() / (200 * Math.random()),
							Math.random() / (200 * Math.random()),
							Math.random() / (200 * Math.random()),
						],
						d = [
							(Math.random() - 0.5) / 30,
							(Math.random() - 0.5) / 30,
							(Math.random() - 0.5) / 30,
						];
					(0, a.useEffect)(function () {
						c.current ? e(c.current) : console.warn("no canvas for rendering");
					}),
						(0, a.useEffect)(function () {
							(function t() {
								if ((requestAnimationFrame(t), c.current)) {
									var e = c.current,
										r = e.getContext("2d");
									r &&
										((x.current = i(0)),
										(v.current = i(1)),
										(p.current = i(2)),
										(j.current = i(3)),
										(m.current = m.current + 1),
										n(e, r));
								}
							})(),
								window.addEventListener("resize", function () {
									if (c.current) {
										var t = c.current;
										e(t);
										var r = t.getContext("2d");
										r && n(t, r);
									}
								});
						}, []);
					var m = (0, a.useRef)(0),
						g = [2, 1.6706, -0.5, -1.1254],
						x = (0, a.useRef)(g[0]),
						v = (0, a.useRef)(g[1]),
						p = (0, a.useRef)(g[2]),
						j = (0, a.useRef)(g[3]),
						w = [250, 20, 90],
						M = (0, a.useRef)(w[0]),
						_ = (0, a.useRef)(w[1]),
						y = (0, a.useRef)(w[2]);
					return (0, o.jsx)("canvas", {
						style: { cursor: "pointer" },
						ref: c,
						onClick: function () {
							(m.current = 0),
								(u[0] = Math.random() / (200 * Math.random())),
								(u[1] = Math.random() / (200 * Math.random())),
								(u[2] = Math.random() / (200 * Math.random())),
								(u[3] = Math.random() / (200 * Math.random()));
						},
					});
				},
				j = function (t) {
					var e = (0, l._)({}, (0, f._)(t)),
						n = e.options,
						r = e.selection,
						s = e.style,
						c = e.onChange,
						h = (0, i._)((0, a.useState)(0), 2),
						u = h[0],
						d = h[1];
					return (
						(0, a.useEffect)(function () {
							d(r);
						}, []),
						(0, o.jsx)(o.Fragment, {
							children: (0, o.jsxs)("div", {
								style: s,
								className:
									"text-white w-full flex rounded-md bg-grey-600 py-1 items-center justify-center text-sm",
								children: [
									(0, o.jsx)("div", {
										className:
											"cursor-pointer px-4 h-fit mb-1 flex items-center",
										onClick: function () {
											var t;
											0 === u ? d((t = n.length - 1)) : d((t = u - 1)), c(t);
										},
										children: "‹",
									}),
									(0, o.jsx)("div", {
										style: { width: "150px", textAlign: "center" },
										children: n[u],
									}),
									(0, o.jsx)("div", {
										className:
											"cursor-pointer px-4 h-fit mb-1 flex items-center",
										onClick: function () {
											var t;
											u === n.length - 1 ? d((t = 0)) : d((t = u + 1)), c(t);
										},
										children: "›",
									}),
								],
							}),
						})
					);
				},
				w = n(1178),
				M = function () {
					var t = (0, i._)((0, a.useState)(""), 2),
						e = t[0],
						n = t[1],
						c = (0, i._)((0, a.useState)(0), 2),
						u = c[0],
						l = c[1],
						f = (0, i._)((0, a.useState)(""), 2),
						m = f[0],
						g = f[1];
					return (
						(0, a.useEffect)(function () {
							function t() {
								return (t = (0, r._)(function () {
									return (0, s.Jh)(this, function (t) {
										switch (t.label) {
											case 0:
												return (
													t.trys.push([0, 3, , 4]),
													[
														4,
														fetch(
															"https://api.github.com/repos/jz-dot-meng/jz-dot-meng.github.io/git/refs/heads/main",
															{
																method: "GET",
																headers: {
																	"Content-Type":
																		"application/json",
																},
															}
														),
													]
												);
											case 1:
												return [4, t.sent().json()];
											case 2:
												return n(t.sent().object.sha.slice(0, 6)), [3, 4];
											case 3:
												return console.warn(t.sent()), [3, 4];
											case 4:
												return [2];
										}
									});
								})).apply(this, arguments);
							}
							(function () {
								t.apply(this, arguments);
							})(),
								setTimeout(function () {
									return g("fadeout-5sec");
								}, 1e3);
						}, []),
						(0, o.jsxs)("div", {
							className: "flex h-full flex-col gap-4 p-8",
							children: [
								(0, o.jsxs)("div", {
									className: "relative h-3/5",
									onMouseOver: function () {
										g("");
									},
									onMouseLeave: function () {
										g("fadeout-5sec");
									},
									children: [
										0 === u && (0, o.jsx)(d, {}),
										1 === u && (0, o.jsx)(p, {}),
										(0, o.jsx)("div", {
											className: "absolute right-0 bottom-0 ".concat(m),
											children: (0, o.jsx)(j, {
												options: ["Particle field", "Clifford Attractor"],
												selection: u,
												onChange: function (t) {
													l(t);
												},
											}),
										}),
									],
								}),
								(0, o.jsxs)("div", {
									className: "flex flex-col gap-4",
									children: [
										(0, o.jsxs)("section", {
											className: "flex flex-col gap-2",
											children: [
												(0, o.jsx)("h4", { children: "@jz-dot-meng" }),
												(0, o.jsx)("h1", {
													className: "font-display font-bold",
													children: "jz.meng",
												}),
												(0, o.jsx)("div", {
													children: (0, o.jsx)(w.p, {
														linkMap: [
															{
																url: "https://github.com/jz-dot-meng",
																name: "Github",
															},
															{
																url: "https://www.instagram.com/meng_beats/",
																name: "Instagram",
															},
															{
																url: "https://twitter.com/jz_dot_meng/",
																name: "Twitter",
															},
														],
													}),
												}),
											],
										}),
										(0, o.jsxs)("section", {
											className: "flex flex-col gap-2 text-sm",
											children: [
												(0, o.jsxs)("div", {
													children: [
														(0, o.jsx)(h(), {
															href: "/minigame/memory",
															children: "Software developer",
														}),
														", occasional sound engineer and music producer",
													],
												}),
												(0, o.jsx)("div", {
													children:
														"Avid home cook, learner of languages (and whatever happens to be of interest to me in the moment!)",
												}),
											],
										}),
										(0, o.jsx)("section", {
											className: "border-t border-white-600 py-4 text-sm",
											children: (0, o.jsxs)("div", {
												children: [
													e
														? (0, o.jsx)("a", {
																href: "https://github.com/jz-dot-meng/jz-dot-meng.github.io",
																children: e,
														  })
														: (0, o.jsx)(v, {
																textLength: 7,
																href: "https://github.com/jz-dot-meng/jz-dot-meng.github.io",
														  }),
													(0, o.jsx)("span", {
														children:
															" :: check out the latest branch commit ",
													}),
												],
											}),
										}),
									],
								}),
							],
						})
					);
				};
		},
		3673: function (t) {
			t.exports = {
				skeleton: "SkeletonText_skeleton__nh249",
				loading: "SkeletonText_loading__QS89Q",
			};
		},
	},
	function (t) {
		t.O(0, [689, 774, 888, 179], function () {
			return t((t.s = 8312));
		}),
			(_N_E = t.O());
	},
]);
