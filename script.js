function balance(e) {
  let t = parse(e)
    , n = buildMatrix(t);
  solve(n);
  let r = extractCoefficients(n);
  return checkAnswer(t, r),
  {
      eqn: t,
      coefs: r
  }
}
function buildMatrix(e) {
  let t = e.getElements()
    , n = t.length + 1
    , r = e.getLeftSide().length + e.getRightSide().length + 1
    , o = new Matrix(n,r);
  for (let l = 0; l < t.length; l++) {
      let i = 0;
      for (let s = 0, u = e.getLeftSide(); s < u.length; i++,
      s++)
          o.set(l, i, u[s].countElement(t[l]));
      for (let a = 0, f = e.getRightSide(); a < f.length; i++,
      a++)
          o.set(l, i, -f[a].countElement(t[l]))
  }
  return o
}
function solve(e) {
  e.gaussJordanEliminate();
  let t;
  for (t = 0; t < e.rowCount() - 1 && !(countNonzeroCoeffs(e, t) > 1); t++)
      ;
  if (t === e.rowCount() - 1)
      throw "All-zero solution";
  e.set(e.rowCount() - 1, t, 1),
  e.set(e.rowCount() - 1, e.columnCount() - 1, 1),
  e.gaussJordanEliminate()
}
function countNonzeroCoeffs(e, t) {
  let n = 0;
  for (let r = 0; r < e.columnCount(); r++)
      0 !== e.get(t, r) && n++;
  return n
}
function extractCoefficients(e) {
  let t = e.rowCount()
    , n = e.columnCount()
    , r = [];
  if (n - 1 > t || 0 === e.get(n - 2, n - 2))
      throw "Multiple independent solutions";
  let o = 1;
  for (let l = 0; l < n - 1; l++)
      o = checkedMultiply(o / gcd(o, e.get(l, l)), e.get(l, l));
  let i = !0;
  for (let s = 0; s < n - 1; s++) {
      let u = checkedMultiply(o / e.get(s, s), e.get(s, n - 1));
      r.push(u),
      i &= 0 === u
  }
  if (i)
      throw "Assertion error: All-zero solution";
  return r
}
function checkAnswer(e, t) {
  if (t.length !== e.getLeftSide().length + e.getRightSide().length)
      throw "Assertion error: Mismatched length";
  let n = e.getElements()
    , r = !0;
  for (let o = 0; o < t.length; o++) {
      let l = t[o];
      if ("number" != typeof l || isNaN(l) || Math.floor(l) !== l)
          throw "Assertion error: Not an integer";
      r &= 0 === l
  }
  if (r)
      throw "Assertion error: All-zero solution";
  for (let i = 0; i < n.length; i++) {
      let s = 0
        , u = 0;
      for (let a = 0, f = e.getLeftSide(); a < f.length; u++,
      a++)
          s = checkedAdd(s, checkedMultiply(f[a].countElement(n[i]), t[u]));
      for (let c = 0, h = e.getRightSide(); c < h.length; u++,
      c++)
          s = checkedAdd(s, checkedMultiply(h[c].countElement(n[i]), -t[u]));
      if (0 !== s)
          throw "Assertion error: Incorrect balance"
  }
}
function Equation(e, t) {
  this.getLeftSide = function() {
      return cloneArray(e)
  }
  ,
  this.getRightSide = function() {
      return cloneArray(t)
  }
  ,
  this.getElements = function() {
      let n = new Set;
      for (let r = 0; r < e.length; r++)
          e[r].getElements(n);
      for (let o = 0; o < t.length; o++)
          t[o].getElements(n);
      return n.toArray()
  }
  ,
  this.toHtml = function(n) {
      if (void 0 !== n && n.length !== e.length + t.length)
          throw "Mismatched number of coefficients";
      function r(e, t) {
          let n = document.createElement("span");
          return appendText(e, n),
          n.className = t,
          n
      }
      let o = document.createElement("span")
        , l = 0;
      function i(e) {
          let t = !0;
          for (let i = 0; i < e.length; i++,
          l++) {
              let s = void 0 !== n ? n[l] : 1;
              0 !== s && (t ? t = !1 : o.appendChild(r(" + ", "plus")),
              1 !== s && o.appendChild(r(s.toString().replace(/-/, MINUS), "coefficient")),
              o.appendChild(e[i].toHtml()))
          }
      }
      return i(e),
      o.appendChild(r(` ${RIGHT_ARROW} `, "rightarrow")),
      i(t),
      o
  }
}
function Term(e, t) {
  if (0 === e.length && -1 !== t)
      throw "Invalid term";
  this.getItems = function() {
      return cloneArray(e)
  }
  ,
  this.getElements = function(t) {
      t.add("e");
      for (let n = 0; n < e.length; n++)
          e[n].getElements(t)
  }
  ,
  this.countElement = function(n) {
      if ("e" === n)
          return -t;
      let r = 0;
      for (let o = 0; o < e.length; o++)
          r = checkedAdd(r, e[o].countElement(n));
      return r
  }
  ,
  this.toHtml = function() {
      let n = document.createElement("span");
      if (0 === e.length && -1 === t) {
          let r = document.createElement("sup");
          appendText("e", n),
          appendText(MINUS, r),
          n.appendChild(r)
      } else {
          for (let o = 0; o < e.length; o++)
              n.appendChild(e[o].toHtml());
          if (0 !== t) {
              let l;
              l = 1 === Math.abs(t) ? "" : Math.abs(t).toString(),
              t > 0 ? l += "+" : l += MINUS;
              let i = document.createElement("sup");
              appendText(l, i),
              n.appendChild(i)
          }
      }
      return n
  }
}
function Group(e, t) {
  if (t < 1)
      throw "Assertion error: Count must be a positive integer";
  this.getItems = function() {
      return cloneArray(e)
  }
  ,
  this.getCount = function() {
      return t
  }
  ,
  this.getElements = function(t) {
      for (let n = 0; n < e.length; n++)
          e[n].getElements(t)
  }
  ,
  this.countElement = function(n) {
      let r = 0;
      for (let o = 0; o < e.length; o++)
          r = checkedAdd(r, checkedMultiply(e[o].countElement(n), t));
      return r
  }
  ,
  this.toHtml = function() {
      let n = document.createElement("span");
      appendText("(", n);
      for (let r = 0; r < e.length; r++)
          n.appendChild(e[r].toHtml());
      if (appendText(")", n),
      1 !== t) {
          let o = document.createElement("sub");
          appendText(t.toString(), o),
          n.appendChild(o)
      }
      return n
  }
}
function Element(e, t) {
  if (t < 1)
      throw "Assertion error: Count must be a positive integer";
  this.getName = function() {
      return e
  }
  ,
  this.getCount = function() {
      return t
  }
  ,
  this.getElements = function(t) {
      t.add(e)
  }
  ,
  this.countElement = function(n) {
      return n === e ? t : 0
  }
  ,
  this.toHtml = function() {
      let n = document.createElement("span");
      if (appendText(e, n),
      1 !== t) {
          let r = document.createElement("sub");
          appendText(t.toString(), r),
          n.appendChild(r)
      }
      return n
  }
}
function parse(e) {
  try {
      let t = new Tokenizer(e);
      return parseEquation(t)
  } catch (n) {
      if ("string" == typeof n)
          throw `Syntax error: ${n}`;
      if ("start"in n) {
          let {start: r} = n
            , o = "end"in n ? n.end : n.start;
          for (; o > r && (" " === e.charAt(o - 1) || "	" === e.charAt(o - 1)); )
              o--;
          throw r === o && o++,
          `Syntax error: ${n.message}`
      }
      throw "Assertion error"
  }
}
function parseEquation(e) {
  let t = []
    , n = [];
  for (t.push(parseTerm(e)); ; ) {
      let r = e.peek();
      if ("=" === r) {
          e.consume("=");
          break
      }
      if (null == r)
          throw {
              message: "Plus or equal sign expected",
              start: e.position()
          };
      if ("+" === r)
          e.consume("+"),
          t.push(parseTerm(e));
      else
          throw {
              message: "Plus expected",
              start: e.position()
          }
  }
  for (n.push(parseTerm(e)); ; ) {
      let o = e.peek();
      if (null == o)
          break;
      if ("+" === o)
          e.consume("+"),
          n.push(parseTerm(e));
      else
          throw {
              message: "Plus or end expected",
              start: e.position()
          }
  }
  return new Equation(t,n)
}
function parseTerm(e) {
  let t = e.position()
    , n = [];
  for (; ; ) {
      let r = e.peek();
      if (null == r)
          break;
      if ("(" === r)
          n.push(parseGroup(e));
      else if (/^[A-Za-z][a-z]*$/.test(r))
          n.push(parseElement(e));
      else
          break
  }
  let o = 0
    , l = e.peek();
  if (null != l && "^" === l) {
      if (e.consume("^"),
      null == (l = e.peek()))
          throw {
              message: "Number or sign expected",
              start: e.position()
          };
      if (o = parseOptionalNumber(e),
      "+" === (l = e.peek()))
          o = +o;
      else if ("-" === l)
          o = -o;
      else
          throw {
              message: "Sign expected",
              start: e.position()
          };
      e.take()
  }
  let i = new Set;
  for (let s = 0; s < n.length; s++)
      n[s].getElements(i);
  if (i = i.toArray(),
  0 === n.length)
      throw {
          message: "Invalid term - empty",
          start: t,
          end: e.position()
      };
  if (-1 !== indexOf(i, "e")) {
      if (n.length > 1)
          throw {
              message: "Invalid term - electron needs to stand alone",
              start: t,
              end: e.position()
          };
      if (0 !== o && -1 !== o)
          throw {
              message: "Invalid term - invalid charge for electron",
              start: t,
              end: e.position()
          };
      n = [],
      o = -1
  } else
      for (let u = 0; u < i.length; u++)
          if (/^[a-z]+$/.test(i[u]))
              throw {
                  message: `Invalid element name "${i[u]}"`,
                  start: t,
                  end: e.position()
              };
  return new Term(n,o)
}
function parseGroup(e) {
  let t = e.position();
  e.consume("(");
  let n = [];
  for (; ; ) {
      let r = e.peek();
      if (null == r)
          throw {
              message: "Element, group, or closing parenthesis expected",
              start: e.position()
          };
      if ("(" === r)
          n.push(parseGroup(e));
      else if (/^[A-Za-z][a-z]*$/.test(r))
          n.push(parseElement(e));
      else if (")" === r) {
          if (e.consume(")"),
          0 === n.length)
              throw {
                  message: "Empty group",
                  start: t,
                  end: e.position()
              };
          break
      } else
          throw {
              message: "Element, group, or closing parenthesis expected",
              start: e.position()
          }
  }
  return new Group(n,parseOptionalNumber(e))
}
function parseElement(e) {
  let t = e.take();
  if (!/^[A-Za-z][a-z]*$/.test(t))
      throw "Assertion error";
  return new Element(t,parseOptionalNumber(e))
}
function parseOptionalNumber(e) {
  let t = e.peek();
  return null != t && /^[0-9]+$/.test(t) ? checkedParseInt(e.take()) : 1
}
function Tokenizer(e) {
  let t = 0;
  function n() {
      let n = /^[ \t]*/.exec(e.substring(t));
      t += n[0].length
  }
  this.position = function() {
      return t
  }
  ,
  this.peek = function() {
      if (t === e.length)
          return null;
      let n = /^([A-Za-z][a-z]*|[0-9]+|[+\-^=()])/.exec(e.substring(t));
      if (null == n)
          throw {
              message: "Invalid symbol",
              start: t
          };
      return n[0]
  }
  ,
  this.take = function() {
      let e = this.peek();
      if (null == e)
          throw "Advancing beyond last token";
      return t += e.length,
      n(),
      e
  }
  ,
  this.consume = function(e) {
      if (this.take() !== e)
          throw "Token mismatch"
  }
  ,
  n()
}
function Matrix(e, t) {
  if (e < 0 || t < 0)
      throw "Illegal argument";
  let n = [];
  for (let r = 0; r < t; r++)
      n.push(0);
  let o = [];
  for (let l = 0; l < e; l++)
      o.push(cloneArray(n));
  function i(t, n) {
      if (t < 0 || t >= e || n < 0 || n >= e)
          throw "Index out of bounds";
      let r = o[t];
      o[t] = o[n],
      o[n] = r
  }
  function s(e, t) {
      let n = cloneArray(e);
      for (let r = 0; r < n.length; r++)
          n[r] = checkedAdd(e[r], t[r]);
      return n
  }
  function u(e, t) {
      let n = cloneArray(e);
      for (let r = 0; r < n.length; r++)
          n[r] = checkedMultiply(e[r], t);
      return n
  }
  function a(e) {
      let t = 0;
      for (let n = 0; n < e.length; n++) {
          if (e[n] > 0) {
              t = 1;
              break
          }
          if (e[n] < 0) {
              t = -1;
              break
          }
      }
      let r = cloneArray(e);
      if (0 === t)
          return r;
      let o = function e(t) {
          let n = 0;
          for (let r = 0; r < t.length; r++)
              n = gcd(t[r], n);
          return n
      }(e) * t;
      for (let l = 0; l < r.length; l++)
          r[l] /= o;
      return r
  }
  n = null,
  this.rowCount = function() {
      return e
  }
  ,
  this.columnCount = function() {
      return t
  }
  ,
  this.get = function(n, r) {
      if (n < 0 || n >= e || r < 0 || r >= t)
          throw "Index out of bounds";
      return o[n][r]
  }
  ,
  this.set = function(n, r, l) {
      if (n < 0 || n >= e || r < 0 || r >= t)
          throw "Index out of bounds";
      o[n][r] = l
  }
  ,
  this.gaussJordanEliminate = function() {
      for (let n = 0; n < e; n++)
          o[n] = a(o[n]);
      let r = 0;
      for (let l = 0; l < t; l++) {
          let f = r;
          for (; f < e && 0 === o[f][l]; )
              f++;
          if (f === e)
              continue;
          let c = o[f][l];
          i(r, f),
          r++;
          for (let h = r; h < e; h++) {
              let p = gcd(c, o[h][l]);
              o[h] = a(s(u(o[h], c / p), u(o[l], -o[h][l] / p)))
          }
      }
      for (let d = e - 1; d >= 0; d--) {
          let g = 0;
          for (; g < t && 0 === o[d][g]; )
              g++;
          if (g === t)
              continue;
          let m = o[d][g];
          for (let $ = d - 1; $ >= 0; $--) {
              let O = gcd(m, o[$][g]);
              o[$] = a(s(u(o[$], m / O), u(o[d], -o[$][g] / O)))
          }
      }
  }
  ,
  this.toString = function() {
      let n = "[";
      for (let r = 0; r < e; r++) {
          0 !== r && (n += "],\n"),
          n += "[";
          for (let l = 0; l < t; l++)
              0 !== l && (n += ", "),
              n += o[r][l];
          n += "]"
      }
      return `${n}]`
  }
}
function Set() {
  let e = [];
  this.add = function(t) {
      -1 === indexOf(e, t) && e.push(t)
  }
  ,
  this.contains = function(t) {
      return -1 !== e.indexOf(t)
  }
  ,
  this.toArray = function() {
      return cloneArray(e)
  }
}
const INT_MAX = 9007199254740992;
function checkedParseInt(e) {
  let t = parseInt(e, 10);
  if (isNaN(t))
      throw "Not a number";
  if (t <= -9007199254740992 || t >= 9007199254740992)
      throw "Arithmetic overflow";
  return t
}
function checkedAdd(e, t) {
  let n = e + t;
  if (n <= -9007199254740992 || n >= 9007199254740992)
      throw "Arithmetic overflow";
  return n
}
function checkedMultiply(e, t) {
  let n = e * t;
  if (n <= -9007199254740992 || n >= 9007199254740992)
      throw "Arithmetic overflow";
  return n
}
function gcd(e, t) {
  if ("number" != typeof e || "number" != typeof t || isNaN(e) || isNaN(t))
      throw "Invalid argument";
  let n = Math.abs(e)
    , r = Math.abs(t);
  for (; 0 !== r; ) {
      let o = n % r;
      n = r,
      r = o
  }
  return n
}
const MINUS = "−"
, RIGHT_ARROW = "→";
function indexOf(e, t) {
  for (let n = 0; n < e.length; n++)
      if (e[n] === t)
          return n;
  return -1
}
function cloneArray(e) {
  return e.slice(0)
}
function appendText(e, t) {
  t.appendChild(document.createTextNode(e))
}
const RANDOM_DEMOS = ["H2 + O2 = H2O", "Fe + O2 = Fe2O3", "NH3 + O2 = N2 + H2O", "C2H2 + O2 = CO2 + H2O", "C3H8O + O2 = CO2 + H2O", "Na + O2 = Na2O", "P4 + O2 = P2O5", "Na2O + H2O = NaOH", "Mg + HCl = MgCl2 + H2", "AgNO3 + LiOH = AgOH + LiNO3", "Pb + PbO2 + H^+ + SO4^2- = PbSO4 + H2O", "HNO3 + Cu = Cu(NO3)2 + H2O + NO", "KNO2 + KNO3 + Cr2O3 = K2CrO4 + NO", "AgNO3 + BaCl2 = Ba(NO3)2 + AgCl", "Cu(NO3)2 = CuO + NO2 + O2", "Al + CuSO4 = Al2(SO4)3 + Cu", "Na3PO4 + Zn(NO3)2 = NaNO3 + Zn3(PO4)2", "Cl2 + Ca(OH)2 = Ca(ClO)2 + CaCl2 + H2O", "CHCl3 + O2 = CO2 + H2O + Cl2", "H2C2O4 + MnO4^- = H2O + CO2 + MnO + OH^-", "H2O2 + Cr2O7^2- = Cr^3+ + O2 + OH^-", "KBr + KMnO4 + H2SO4 = Br2 + MnSO4 + K2SO4 + H2O", "K2Cr2O7 + KI + H2SO4 = Cr2(SO4)3 + I2 + H2O + K2SO4", "KClO3 + KBr + HCl = KCl + Br2 + H2O", "Ag + HNO3 = AgNO3 + NO + H2O", "P4 + OH^- + H2O = H2PO2^- + P2H4", "Zn + NO3^- + H^+ = Zn^2+ + NH4^+ + H2O", "ICl + H2O = Cl^- + IO3^- + I2 + H^+", "AB2 + AC3 + AD5 + AE7 + AF11 + AG13 + AH17 + AI19 + AJ23 = A + ABCDEFGHIJ", ];
let lastRandomIndex = -1;
function random() {
  let e;
  do
      e = Math.max(Math.min(e = Math.floor(Math.random() * RANDOM_DEMOS.length), RANDOM_DEMOS.length - 1), 0);
  while (RANDOM_DEMOS.length >= 2 && e === lastRandomIndex);
  return lastRandomIndex = e,
  RANDOM_DEMOS[e]
}
function balanceEquation() {
  let e = document.getElementById("equation").value;
  try {
      let {eqn: t, coefs: n} = balance(e);
      document.getElementById("result").innerHTML = t.toHtml(n).outerHTML
  } catch (r) {
      document.getElementById("result").textContent = `Error: ${r}`
  }
}
function setRandomEquation() {
  let e = document.getElementById("equation");
  e.value = random()
}
