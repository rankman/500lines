// Generated by LiveScript 1.2.0
(function(){
  var ref$, table, thead, tbody, tr, th, td, input, div, button, SheetDefault, SheetInit, Table, Row, Cell;
  ref$ = React.DOM, table = ref$.table, thead = ref$.thead, tbody = ref$.tbody, tr = ref$.tr, th = ref$.th, td = ref$.td, input = ref$.input, div = ref$.div, button = ref$.button;
  SheetDefault = {
    A1: 1874,
    B1: '+',
    C1: 2046,
    D1: '⇒',
    E1: '=A1+C1'
  };
  SheetInit = (function(){
    try {
      return JSON.parse(localStorage.getItem(''));
    } catch (e$) {}
  }()) || SheetDefault;
  Table = React.createClass({
    getDefaultProps: function(){
      return {
        Cols: ["A", "B", "C", "D", "E", "F", "G", "H"],
        Rows: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      };
    },
    getInitialState: function(){
      return {
        sheet: SheetInit,
        vals: {},
        errs: {}
      };
    },
    render: function(){
      var col, row, this$ = this;
      return table({}, thead({}, tr.apply(null, [
        {}, th({}, button({
          type: 'button',
          onClick: function(){
            return this$.reset();
          }
        }, '↻'))
      ].concat((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = this.props.Cols).length; i$ < len$; ++i$) {
          col = ref$[i$];
          results$.push(th({}, col));
        }
        return results$;
      }.call(this))))), tbody.apply(null, [{}].concat((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = this.props.Rows).length; i$ < len$; ++i$) {
          row = ref$[i$];
          results$.push(Row(import$({
            row: row,
            Cols: this.props.Cols,
            onChange: fn$
          }, this.state)));
        }
        return results$;
        function fn$(){
          return this$.onChange.apply(this$, arguments);
        }
      }.call(this)))));
    },
    reset: function(){
      return this.calc(SheetDefault);
    },
    componentDidMount: function(){
      return this.calc(this.state.sheet);
    },
    calc: function(sheet){
      var worker, timeout, this$ = this;
      worker = this.props.worker;
      timeout = setTimeout(function(){
        worker.terminate();
        return this$.setProps({
          worker: new Worker('worker.js')
        });
      }, 99);
      worker.onmessage = function(arg$){
        var ref$, errs, vals;
        ref$ = arg$.data, errs = ref$[0], vals = ref$[1];
        clearTimeout(timeout);
        localStorage.setItem('', JSON.stringify(sheet));
        return this$.setState({
          sheet: sheet,
          errs: errs,
          vals: vals
        });
      };
      return worker.postMessage(sheet);
    },
    onChange: function(arg$){
      var ref$, id, value, sheet;
      ref$ = arg$.target, id = ref$.id, value = ref$.value;
      sheet = import$({}, this.state.sheet);
      sheet[id] = value;
      return this.calc(sheet);
    }
  });
  Row = React.createClass({
    render: function(){
      var ref$, Cols, sheet, vals, errs, row, onChange, col, id, onKeyDown, this$ = this;
      ref$ = this.props, Cols = ref$.Cols, sheet = ref$.sheet, vals = ref$.vals, errs = ref$.errs, row = ref$.row, onChange = ref$.onChange;
      return tr.apply(null, [{}, th({}, row)].concat((function(){
        var i$, ref$, len$, results$ = [];
        for (i$ = 0, len$ = (ref$ = Cols).length; i$ < len$; ++i$) {
          col = ref$[i$];
          id = col + row;
          onKeyDown = fn$;
          results$.push(Cell({
            id: id,
            col: col,
            onChange: onChange,
            onKeyDown: onKeyDown,
            txt: sheet[id],
            err: errs[id],
            val: vals[id]
          }));
        }
        return results$;
        function fn$(){
          return this$.onKeyDown.apply(this$, arguments);
        }
      }())));
    },
    onKeyDown: function(arg$, col){
      var target, which, direction, cell;
      target = arg$.target, which = arg$.which;
      switch (false) {
      case which !== 38 && which !== 40 && which !== 13:
        direction = which === 38
          ? -1
          : +1;
        cell = document.querySelector("#" + col + (this.props.row + direction));
        return cell != null ? cell.focus() : void 8;
      }
    }
  });
  Cell = React.createClass({
    render: function(){
      var ref$, id, col, txt, err, val, onChange, onKeyDown;
      ref$ = this.props, id = ref$.id, col = ref$.col, txt = ref$.txt, err = ref$.err, val = ref$.val, onChange = ref$.onChange, onKeyDown = ref$.onKeyDown;
      return td({
        className: /^=/.exec(txt) ? 'formula' : ''
      }, input({
        id: id,
        type: 'text',
        value: txt,
        onChange: onChange,
        onKeyDown: function(it){
          return onKeyDown(it, col);
        }
      }, div({
        className: err
          ? 'error'
          : val != null && val[0] ? 'text' : ''
      }, err || val)));
    }
  });
  window.init = function(){
    var worker;
    worker = new Worker('worker.js');
    worker.onmessage = function(){
      return React.renderComponent(Table({
        worker: worker
      }), document.body);
    };
    return worker.postMessage(null);
  };
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);