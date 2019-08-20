var overlayInfuser = ( function() {
  var overlay = document.createElement('img');
  var overlayInformation = document.createElement('div');
  var overlayHelp = document.createElement('div');
  var overlayInformationTimeout;
  var overlaySrc;
  var pressedKeys = [];
  var blockedKeys = [ 17, 33, 34, 37, 38, 39, 40, 46, 191 ];
  var controls = [
    ctrlRight = {
      check : function() { return (pressedKeys.indexOf(39) !== -1) && (pressedKeys.indexOf(17) !== -1); },
      result : function() { changeCoordinates ('horizontal', 10); }
    },
    right = {
      check : function() { return (pressedKeys.indexOf(39) !== -1); },
      result : function() { changeCoordinates ('horizontal', 1); }
    },
    ctrlLeft = {
      check : function() { return (pressedKeys.indexOf(37) !== -1) && (pressedKeys.indexOf(17) !== -1); },
      result : function() { changeCoordinates ('horizontal', -10); }
    },
    left = {
      check : function() { return (pressedKeys.indexOf(37) !== -1); },
      result : function() { changeCoordinates ('horizontal', -1); }
    },
    ctrlUp = {
      check : function() { return (pressedKeys.indexOf(38) !== -1) && (pressedKeys.indexOf(17) !== -1); },
      result : function() { changeCoordinates ('vertical', -10); }
    },
    up = {
      check : function() { return (pressedKeys.indexOf(38) !== -1); },
      result : function() { changeCoordinates ('vertical', -1); }
    },
    ctrlDown = {
      check : function() { return (pressedKeys.indexOf(40) !== -1) && (pressedKeys.indexOf(17) !== -1); },
      result : function() { changeCoordinates ('vertical', 10); }
    },
    down = {
      check : function() { return (pressedKeys.indexOf(40) !== -1); },
      result : function() { changeCoordinates ('vertical', 1); }
    },
    comma = {
      check : function() { return (pressedKeys.indexOf(188) !== -1); },
      result : function() { changeOpacity (-1); }
    },
    period = {
      check : function() { return (pressedKeys.indexOf(190) !== -1); },
      result : function() { changeOpacity (1); }
    },
    pageUp = {
      check : function() { return (pressedKeys.indexOf(33) !== -1); },
      result : function() { changeOverlaySrc ('previous'); }
    },
    pageDown = {
      check : function() { return (pressedKeys.indexOf(34) !== -1); },
      result : function() { changeOverlaySrc ('next'); }
    },
    home = {
      check : function() { return (pressedKeys.indexOf(36) !== -1); },
      result : function() { resetCoordinates (); }
    },
    backquote = {
      check : function() { return (pressedKeys.indexOf(192) !== -1); },
      result : function() { toggleDisplay(); }
    },
    questionMark = {
      check : function() { return (pressedKeys.indexOf(191) !== -1); },
      result : function() { toggleHelp(); }
    },
    del = {
      check : function() { return (pressedKeys.indexOf(46) !== -1); },
      result : function() { clearLocalStorage(); }
    }
  ];
  var styleList = {
    'overlay' : {
      'display' : 'block',
      'position' : 'absolute',
      'z-index' : '9999'
    },
    'overlayInformation' : {
      'display' : 'none',
      'justify-content' : 'center',
      'background-color' : '#eeeeee',
      'border-radius' : '25px',
      'position' : 'fixed',
      'top' : '48%',
      'left' : '50%',
      'margin-left' : '-160px',
      'width' : '320px',
      'fontSize' : '25px',
      'z-index' : '9999'
    },
    'overlayHelp' : {
      'display' : 'none',
      'justify-content' : 'center',
      'background-color' : '#eeeeee',
      'border-radius' : '25px',
      'position' : 'fixed',
      'top' : '20%',
      'left' : '50%',
      'margin-left' : '-275px',
      'width' : '550px',
      'font-size' : '25px',
      'z-index' : '9999',
      'text-align': 'center'
    }
  };

  function styleElements(list) {
    for (var element in list) {
      var stylesToApply = ''
      for (var property in list[element]) {
        stylesToApply = stylesToApply + property + ':' + list[element][property] + ';';
      }
      eval(element).style.cssText = stylesToApply;
    }
  };

  function initialStyle() {
    styleElements (styleList);
    if (localStorage.getItem('overlaynumber')) {
      overlay.src = './overlays/overlay' + (localStorage.getItem('overlaynumber'));
      overlaySrc = localStorage.getItem('overlaynumber');
    } else {
      overlay.src = './overlays/overlay0';
      overlaySrc = 0;
    };
    if (localStorage.getItem('vertical')) {
      overlay.style.top = localStorage.getItem('vertical');
    } else {
      overlay.style.top = '0';
    };
    if (localStorage.getItem('horizontal')) {
      overlay.style.left = localStorage.getItem('horizontal');
    } else {
      overlay.style.left = '0';
    };
    if (localStorage.getItem('opacity')) {
      overlay.style.opacity = localStorage.getItem('opacity');
    } else {
      overlay.style.opacity = '0.5';
    };
    overlay.style.width = '"' + overlay.naturalWidth + 'px' + '"';
    overlay.style.height = '"' + overlay.naturalHeight + 'px' + '"';
    overlayHelp.innerHTML = '<br>Arrows – Move overlay</br><br>Ctrl + arrows – Wide steps</br><br>PageUp/PageDown – Previous/Next overlay</br><br>Comma/Period – Change overlay opacity</br><br>Home – Reset overlay position</br><br>Backquote – Show/Hide overlay</br><br>Delete – Clear local storage</br>';
    document.body.insertBefore(overlay, null);
    document.body.insertBefore(overlayInformation, null);
    document.body.insertBefore(overlayHelp, null);
  };

  function showOverlayInformation() {
    clearTimeout(overlayInformationTimeout);
    overlayInformation.style.display = 'flex';
    overlayInformation.innerHTML = '<br>Horizontal offset: ' + overlay.style.left + '</br><br>Vertical offset: ' + overlay.style.top + '</br><br>Overlay opacity: ' + ((overlay.style.opacity * 100) +'%') + '</br><br>Overlay number: ' + overlaySrc +'</br>';
    overlayInformationTimeout = setTimeout (function () {
      overlayInformation.style.display = 'none';
    }, 1000);
  };

  function changeCoordinates(axis, step) {
    if (axis === 'vertical') {
      overlay.style.top = +overlay.style.top.slice(0, -2) + parseInt(step, 10) + 'px';
      localStorage.setItem('vertical', overlay.style.top);
    } else {
      overlay.style.left = +overlay.style.left.slice(0, -2) + parseInt(step, 10) + 'px';
      localStorage.setItem('horizontal', overlay.style.left);
    }
    showOverlayInformation();
  };

  function resetCoordinates() {
    overlay.style.top = 0;
    overlay.style.left = 0;
    localStorage.setItem('vertical', overlay.style.top);
    localStorage.setItem('horizontal', overlay.style.left);
    showOverlayInformation();
  };

  function changeOpacity(change) {
    overlay.style.opacity = ((overlay.style.opacity * 10) + change) / 10;
    if (overlay.style.opacity < 0) {
      overlay.style.opacity = 0;
    } else if (overlay.style.opacity > 1) {
      overlay.style.opacity = 1;
    }
    localStorage.setItem('opacity', overlay.style.opacity);
    showOverlayInformation();
  };

  function changeOverlaySrc(change) {
    if (change === 'next') {
      overlay.src = './overlays/overlay' + (++overlaySrc);
    } else {
      if (overlaySrc > 0) {
        overlay.src = './overlays/overlay' + (--overlaySrc);
      }
    }
    localStorage.setItem('overlaynumber', overlaySrc);
    showOverlayInformation();
  };

  function toggleDisplay() {
    if (overlay.style.display === 'block') {
      overlay.style.display = 'none';
    } else {
      overlay.style.display = 'block';
    }
  };

  function toggleHelp() {
    if (overlayHelp.style.display === 'none') {
      overlayHelp.style.display = 'flex';
    } else { overlayHelp.style.display = 'none' }
  };

  function removeKey(unpressedKey) {
    for (var i = 0; i < pressedKeys.length; i++) {
      if (pressedKeys[i] === unpressedKey) {
        pressedKeys.splice(i, 1);
      }
    }
  };

  function addKey(pressedKey) {
    if (pressedKeys.indexOf(event.keyCode) === -1) {
      pressedKeys.push(pressedKey);
    }
  };

  function checkControls() {
    for (var i = 0; i < controls.length; i++) {
      if (controls[i].check()) {
        controls[i].result();
        break
      }
    }
  };

  function clearLocalStorage () {
    localStorage.removeItem('opacity');
    localStorage.removeItem('vertical');
    localStorage.removeItem('horizontal');
    localStorage.removeItem('overlaynumber');
  };

  initialStyle();

  document.addEventListener('keydown', function(event) {
    if (blockedKeys.indexOf(event.keyCode) !== -1) {
      event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    };
    addKey(event.keyCode);
    checkControls();
  });

  document.addEventListener('keyup', function(event) {
    removeKey(event.keyCode);
  });
}) ();
