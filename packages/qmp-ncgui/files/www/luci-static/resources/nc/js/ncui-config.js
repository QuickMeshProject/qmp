// Some global config variables
var dragSteps = 100;
var errorLevel = -1;
var remoteTimeout = 180000;
var testTimeout = 18000;
var localTimeout = 180000;
var ajaxTimeout = 5000;
var ajaxTimeoutAdd = 2000;
var ajaxRetryLimit = 5;
var debugVar;

var nodeColourLocal = "#FDD",
    nodeColourLocalCenter = "#FAA",
    nodeColourCenter = "#AAF",
    nodeColourNCD = "#EEF",
    nodeColourSelected = "#FFFFFF",
    nodeColourDefault = "#CCD";
var linkOpacityCenter = 0.8,
	linkOpacityDefault = 0.4;
var strokeDefault = "#aaa";
var currentZoom = 4,
    minZoom = 1,
    maxZoom=7,
    rPerZoom = 3;
var currentDistance = 3,
    minDistance = 1,
    maxDistance=9,
    distPerZoom = 8,
    baseDist = 28;
var currentThickness = 3,
    minThickness = 1,
    maxThickness = 7,
    tPerZoom = 1;
var iconWidth = 20,
    iconHeight = 20,
    borderSpace = 5,
    iconSpace = 10;

var graphBackgroundColour = "#f0faff";

var labelFontSize = "12px";

var defaultStrokeWidth = 1,
	maxStrokeWidth = 10;

var UBUSERROR_NCDVERSION = 200;

$.ajaxSetup({
  retryLimit: ajaxRetryLimit,
  timeout: ajaxTimeout,
  tryCount: 0
});

