(function(window, document, exportName, undefined) {
    "use strict";
    
    var mapCanvas = null;
    var onZoomFunction = null;
    var onIdentifyFunction = null;
    var onPanFunction = null;
    var deltaX = 0;
    var deltaY = 0;
    
    function onPan(ev){
        if (ev.isFirst) {
            deltaX = 0;
            deltaY = 0;            
        }
        var currDeltaX = ev.deltaX - deltaX;
        var currDeltaY = ev.deltaY - deltaY;
        deltaX = ev.deltaX;
        deltaY = ev.deltaY;
        onPanFunction(currDeltaX,currDeltaY);
    }
    
    function onPress(ev){
        onIdentifyFunction(ev.pointers[0].clientX,ev.pointers[0].clientY);
    }
    
    function zoomOut(){
        onZoomFunction(-1);
    }

    function zoomIn(){
        onZoomFunction(1);
    }
    
    function mouseWheelHandler(e) {
        // cross-browser wheel delta
        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        if (delta < 0) {
            zoomIn();
        }else{
            zoomOut();
        }
        return false;
    }
    
    /**
     * GestureManager initializer
     * @param map canvas id
     */
    function GestureManager(_mapCanvas,_onPan,_onZoom,_onIdentify) {
        mapCanvas = _mapCanvas;
        onPanFunction = _onPan;
        onZoomFunction = _onZoom;
        onIdentifyFunction = _onIdentify;
        
        var mc = new Hammer.Manager(mapCanvas,{
            transform_always_block: true,
            transform_min_scale: 1,
            drag_block_horizontal: true,
            drag_block_vertical: true,
            drag_min_distance: 0        
        });
        mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
        mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Press({ threshold: 10 })).recognizeWith(mc.get('pan'));
        mc.on("panleft panright panup pandown", onPan);
        mc.on("pinchin", zoomOut);
        mc.on("pinchout", zoomIn);
        mc.on("press", onPress);
        
        if (mapCanvas.addEventListener) {
            // IE9, Chrome, Safari, Opera
            mapCanvas.addEventListener("mousewheel", mouseWheelHandler, false);
            // Firefox
            mapCanvas.addEventListener("DOMMouseScroll", mouseWheelHandler, false);
        } else {
            // IE 6/7/8
            mapCanvas.attachEvent("onmousewheel", mouseWheelHandler);
        }
        return;
    }
    
    // export
    if (typeof define == "function" && define.amd) {
        define(function() {
            return GestureManager;
        });
    } else if (typeof module != "undefined" && module.exports) {
        module.exports = GestureManager;
    } else {
        window[exportName] = GestureManager;
    }    
})(window, document, "GestureManager");