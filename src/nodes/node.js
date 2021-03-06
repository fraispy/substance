sc.views.Node = Dance.Performer.extend(_.extend({}, s.StateMachine, {

  className: 'content-node',

  attributes: {
    draggable: 'false'
  },

  initialize: function (options) {
    this.state  = 'read';
    this.document = options.document;
    $(this.el).attr({ id: _.htmlId(this.model) });
  },

  transitionTo: function (state) {
    StateMachine.transitionTo.call(this, state);
    if (this.state === state) {
      this.afterControls.transitionTo(state);
    }
  },

  // Dispatching a change
  dispatch: function() {
    dispatch(this.serializeUpdate());
  },

  // Events
  // ------

  focus: function () {},

  render: function () {
    $(this.el).html('<div class="content" contenteditable="true"></div><div class="handle"></div><div class="comments-toggle">'+this.document.comments(this.model.id)+'</div>');
    return this;
  }
}), {


  // States
  // ------

  states: {
    read: {
      enter: function () {},
      leave: function () {}
    },
    
    write: {
      enter: function () {},
      leave: function () {}
    },

    move: {
      enter: function () {
        $(this.el).addClass('being-moved'); // TODO
      },
      leave: function (nextState) {
        if (nextState === 'moveTarget') { return false; }
        $(this.el).removeClass('being-moved'); // TODO
      }
    },

    moveTarget: {
      enter: function () {},
      leave: function () {}
    }
  },

  // Inheritance & Instantiation
  // ---------------------------

  subclasses: {},

  define: function (types, protoProps, classProps) {
    classProps = classProps || {};
    var subclass = this.extend(protoProps, classProps);
    
    function toArray (a) { return _.isArray(a) ? a : [a] }
    _.each(toArray(types), function (type) {
      this.subclasses[type] = subclass;
    }, this);
    
    return subclass;
  },

  create: function (options) {
    var model = options.model,
        type = model.type,
        Subclass = this.subclasses[type];
    
    if (!Subclass) { throw new Error("Node has no subclass for type '"+type+"'"); }
    return new Subclass(options);
  }

});