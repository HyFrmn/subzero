define(['sge/component'], function(Component){
    var ControlsComponent = Component.extend({
        init: function(entity, data){
            this._super(entity, data);
            this.data.speed = data.speed || 128;
            this.primaryAction=this.primaryAction.bind(this);
        },
        register: function(state){
            this.input = state.input;
            this.input.addListener('keydown:space', this.primaryAction);
            this.input.addListener('tap', this.primaryAction);
        },
        deregister: function(state){
            this.input = undefined;
            this.input.removeListener('keydown:space', this.primaryAction);
            this.input.removeListener('tap', this.primaryAction);
        },
        primaryAction: function(){
            this.entity.fireEvent('equipment.use');
        },
        tick : function(delta){
            if (this.input===undefined){
                return;
            }
            var dpad = this.input.dpad();
            var xaxis = dpad[0];
            var yaxis = dpad[1];

            vx = this.entity.set('movement.vx', xaxis);
            vy = this.entity.set('movement.vy', yaxis);
        }
    });
    Component.register('controls', ControlsComponent);
    return ControlsComponent;
});
