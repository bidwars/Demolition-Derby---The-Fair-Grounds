# Demolition-Derby---The-Fair-Grounds

9.0.0 beta - debug code is still turned on for internal testing. 
1) Created a new Derby Scenario App.  This allows you to drive to any point on the map in freeroam.  Once you have a place to derby then you open the Demolition Derby app and click the Start Scenario button.  The new app can be used on any map in freeroam mode.  The location must have two waypoints and one road between the waypoint's to the ai's spawn point.  
2) Added tooltips to the Scenario loading screen. Click the ? mark for more information.
3) Changed the load point for the derby files. Also renamed and simplifed the file names. 
4) Moved the racing ai over to the gdai file.  This should make the ai more like the original ai from the game when racing.
5) The winning vehicle driver name is now random. 
6) Added a Setting tab on the sceanrio loading screen.  For future use.
7) AI will now drive to a target point before going after a target.  Still a WIP. 

8.5.0
1) Improved welding on large vehicles and van,trucks
2) Rewrite of the Derby AI.
3) Fix for overheating vehicles. They can still overheat to the point of the engine shutdown but only if the radiator is damaged.

8.0.3 Alpha Update
1) Added auto reverse for the interior camera
2) Fixed a bug in findtarget for Derby AI

8.0.2 Alpha Update
1) Fixed welding on large vehicles and van,trucks.

8.0 Alpha Update
1) Fixed loading errors after the BeamNG 12 update
2) Fixed the Derby Place App 
3) Added Oval Derby and Mud Pit Derby
4) Renamed old Mud Pit Derby to Varied Ground Derby
5) Corrected text on scenario to 17 opponents
6) Fastest lap information will be stored in the BeamNG.drive\levels\derby\racedata folder. 
7) Added code for ai for collisions and side-to-side racing. 
8) Added a race ending message with top three places. 
9)  
 Known Problems:  
  a) Oval Racing - Causing a vehicle exception because of an issue with the throttle value. 
  b) Oval Racing - Waypoints on start need adjustment.  AI drives to the right on start. 
  b) Welding - Sometimes not working if duplicate nodes are found.
  c) Lap Count - Lap Count and Checkpoint Count are not working.  Bug might be a BeamNG problem.

7.9 Alpha Update 
1) Optimized the derby ai code.  
2) Added partial welding to all vehicles.
3) Made changes to the racing to drive based on best lap time.  The ai will adjust on each lap to get the fastest lap.

7.8 Alpha Update  - 
1) Pausing the scenario will pause the timer so you will not be called out.
2) Corrections/ Additions to the Ctrl + E function in BeamNG.   You can switch cars at any point now if you pause the scenario.
3) Changes to the startup so that it does not have a delay anymore.  BeamNG made changes on their end to add a delay. 

7.7 Alpha Update 
1) Work to combine the gas/throttle function call from the derbyai and raceai.
2) Adjustments to ai when close to wall in derby. If they sit to long they should try a different direction.
3) Adjustments to the lookahead for racing ai. Ai was looking to far ahead causing it to crash into walls. 
4) Corrected an issue if you did not change any of the car config when starting the scenario.  Would load the wrong vehicle if one was picked. 



