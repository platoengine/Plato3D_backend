#### import the simple module from the paraview
from paraview.simple import *
import sys

inFileName=sys.argv[1]
outFileName=sys.argv[2]

#### disable automatic camera reset on 'Show'
paraview.simple._DisableFirstRenderCameraReset()

# create a new 'STL Reader'
finalstl = STLReader(FileNames=[inFileName])

# get active view
renderView1 = GetActiveViewOrCreate('RenderView')
# uncomment following to set a specific view size
# renderView1.ViewSize = [874, 658]

# show data in view
finalstlDisplay = Show(finalstl, renderView1)
# trace defaults for the display properties.
finalstlDisplay.Representation = 'Surface'
finalstlDisplay.ColorArrayName = [None, '']
finalstlDisplay.OSPRayScaleFunction = 'PiecewiseFunction'
finalstlDisplay.SelectOrientationVectors = 'None'
finalstlDisplay.ScaleFactor = 0.4003463745117188
finalstlDisplay.SelectScaleArray = 'None'
finalstlDisplay.GlyphType = 'Arrow'
finalstlDisplay.GlyphTableIndexArray = 'None'
finalstlDisplay.DataAxesGrid = 'GridAxesRepresentation'
finalstlDisplay.PolarAxes = 'PolarAxesRepresentation'

# reset view to fit data
renderView1.ResetCamera()

# update the view to ensure updated data information
renderView1.Update()

# save data
SaveData(outFileName, proxy=finalstl, FileType='Ascii',
    ColorArrayName=['POINTS', ''],
    LookupTable=None)

#### saving camera placements for all active views

# current camera placement for renderView1
renderView1.CameraPosition = [1.7517318725585938, 0.0, 10.45545849381482]
renderView1.CameraFocalPoint = [1.7517318725585938, 0.0, 0.011699855327606201]
renderView1.CameraParallelScale = 2.7030436380944627

#### uncomment the following to render all views
# RenderAllViews()
# alternatively, if you want to write images, you can use SaveScreenshot(...).
