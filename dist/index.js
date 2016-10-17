(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function getContext(canvas) {
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}

function start() {
  var canvas = document.getElementById('glcanvas');

  // Initialize the GL context
  var gl = getContext(canvas);

  // Only continue if WebGL is available and working
  if (!gl) {
    console.error('Unable to initialize WebGL. Your browser may not support it.');
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Enable depth testing
  gl.enable(gl.DEPTH_TEST);
  // Near things obscure far things
  gl.depthFunc(gl.LEQUAL);
  // Clear the color as well as the depth buffer.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

window.addEventListener('load', start);

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLFNBQUEsQUFBUyxXQUFULEFBQW9CLFFBQVEsQUFDMUI7U0FBTyxPQUFBLEFBQU8sV0FBUCxBQUFrQixZQUFZLE9BQUEsQUFBTyxXQUE1QyxBQUFxQyxBQUFrQixBQUN4RDs7O0FBRUQsU0FBQSxBQUFTLFFBQVEsQUFDZjtNQUFNLFNBQVMsU0FBQSxBQUFTLGVBQXhCLEFBQWUsQUFBd0IsQUFFdkM7O0FBQ0E7TUFBTSxLQUFLLFdBQVgsQUFBVyxBQUFXLEFBRXRCOztBQUNBO01BQUksQ0FBSixBQUFLLElBQUksQUFDUDtZQUFBLEFBQVEsTUFBUixBQUFjLEFBQ2Q7QUFDRDtBQUVEOztBQUNBO0tBQUEsQUFBRyxXQUFILEFBQWMsS0FBZCxBQUFtQixLQUFuQixBQUF3QixLQUF4QixBQUE2QixBQUM3QjtBQUNBO0tBQUEsQUFBRyxPQUFPLEdBQVYsQUFBYSxBQUNiO0FBQ0E7S0FBQSxBQUFHLFVBQVUsR0FBYixBQUFnQixBQUNoQjtBQUNBO0tBQUEsQUFBRyxNQUFNLEdBQUEsQUFBRyxtQkFBbUIsR0FBL0IsQUFBa0MsQUFDbkM7OztBQUlELE9BQUEsQUFBTyxpQkFBUCxBQUF3QixRQUF4QixBQUFnQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBnZXRDb250ZXh0KGNhbnZhcykge1xuICByZXR1cm4gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJykgfHwgY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xufVxuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dsY2FudmFzJyk7XG5cbiAgLy8gSW5pdGlhbGl6ZSB0aGUgR0wgY29udGV4dFxuICBjb25zdCBnbCA9IGdldENvbnRleHQoY2FudmFzKTtcblxuICAvLyBPbmx5IGNvbnRpbnVlIGlmIFdlYkdMIGlzIGF2YWlsYWJsZSBhbmQgd29ya2luZ1xuICBpZiAoIWdsKSB7XG4gICAgY29uc29sZS5lcnJvcignVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wuIFlvdXIgYnJvd3NlciBtYXkgbm90IHN1cHBvcnQgaXQuJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU2V0IGNsZWFyIGNvbG9yIHRvIGJsYWNrLCBmdWxseSBvcGFxdWVcbiAgZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApO1xuICAvLyBFbmFibGUgZGVwdGggdGVzdGluZ1xuICBnbC5lbmFibGUoZ2wuREVQVEhfVEVTVCk7XG4gIC8vIE5lYXIgdGhpbmdzIG9ic2N1cmUgZmFyIHRoaW5nc1xuICBnbC5kZXB0aEZ1bmMoZ2wuTEVRVUFMKTtcbiAgLy8gQ2xlYXIgdGhlIGNvbG9yIGFzIHdlbGwgYXMgdGhlIGRlcHRoIGJ1ZmZlci5cbiAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IGdsLkRFUFRIX0JVRkZFUl9CSVQpO1xufVxuXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBzdGFydCk7XG4iXX0=
