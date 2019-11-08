# Demolition-Derby---The-Fair-Grounds
10.2.0 
1) Created a dynamic roofsign that will be added to each of the vehicles.  The dynamic roofsign will display the vehicle number.  
2) Fixed welding groups not being closed properly
3) Added a breakable roofstick to indicate when a vehicle is out  
4) Fixed the derby prefab to show barriers again
5) Fixed the ai waypoint system so it finds the correct arena waypoints
6) Changed the spawn roation and position function to correct heats not spawning in the correct direction
7) More work on heats to show loading message.
8) Added driver name and number to show who is being called out
9) Added configs for Bluebuck
10) Fixed waypoints for figure 8 concrete
11) Fixed place app lap count 
12) Updated ai file to newest beamng version

10.1.0
1) Fixed an error with the scenario end for derby causing beamng to crash to desktop
2) Fixed some of the vehicle high beam strength for welding 
3) Heats 
 Worked on loading each round.
 Worked on vehicle loading in the damaged state 
4) Fixed Random class not showing all vehicle options

10.0.10
1) Fixed the menu drop downs
2) Fixed heat reloads

10.0.6
1) Fixed scenario name not showing correctly on restarts.  Only happening on addon mods
2) Fixed and issue searching for available vehicles.  Causing a lua error and not loading vehicles. 
3) Fixed an issue with the waypoints triggering for each vehicle.  In racing arena's you will not be able to switch vehicles anymore.  
4) Fixed decal road for figure 8.

10.0.0
1) Added Support for the following mods:
The Realistic Derby Project by NoDakSmack -https://www.beamng.com/threads/the-realistic-derby-project-demolition-derby-mod-1-1-0.61069/

High Speed Figure 8 Race by danielr -
https://www.beamng.com/resources/high-speed-figure-8-race.8058/ 

2) Menu Changes
a) Added parts config for vehicle parts files created by NoDakSmack.
b) Added a Custom Parts Tab that will allow you to select parts for each vehicle model.

Custom Parts Tab 
***You must have The Realistic Derby Project mod installed before the Custom Parts Tab will work. 

***Only works for Large Cars vehicle classes 

c) Menu reloading: menu options will save and reload when starting the program

3) Added menu option for optional settings

Options include
Heats: Not Working!!!!
Fire: allow or disable fires
Fuel: allow or disable fuel leaks
Camera: Driver camera auto rotation enable or disable
Radiator: Set the over heating based on radiator damage. 

4) Changed the Racing AI to use preset waypoints list. 

Known Issues:
Some of the parts combinations picked will cause vehicle instabilities. You will need to reload the scenario.
figure 8 is not working with new ai waypoints system
Waypoints are triggered from ai
High Speed Figure 8 Race - reloading scenario causes scenario name and description to revert back to the Fair Ground Derby Scenario name and description

9.0.5 
1) Fix for xbox controller issue.  Caused by having the menu active with the scenario started.  
2) Fixed the racing ai on the derby map figure 8
9.0.2 
1) Testing to see if this fixes the shifting issues

9.0.1
1)New vehicle configs
2)Fix for scenario not showing. You should not have to unpack the mod. 

9.0.0
1) Created a new Derby Scenario App.  This allows you to drive to any point on the map in freeroam.  Once you have a place to derby then you open the Demolition Derby app and click the Start Scenario button.  The new app can be used on any map in freeroam mode.  The location must have two waypoints and one road between the waypoint's to the ai's spawn point.  
2) Added tooltips to the Scenario loading screen. Click the ? mark for more information.
3) Changed the load point for the derby files. Also renamed and simplifed the file names
4) Moved the racing ai over to the gdai file.  This should make the ai more like the original ai from the game when racing
5) The winning vehicle driver name is now random
6) Added a Setting tab on the sceanrio loading screen.  For future use
7) AI will now drive to a target point before going after a target
8) Added collision detection for out of Arena
9) Fixed wall collision detection for Arena if driving backwards
10) Added more AI aggression
11) Fixed the derbyPlace App so it will show when the race scenario is started
12) Added a random target point for the AI
13) Add bus to the random filter
14) Changed restarts so it does not delete vehicles
15) Fixed the lap and checkpoints for racing scenario
16) Fixed lookback camera
17) Updated scenario Images.  Created by DD-Indeed
18) Updated vehicles configs.  Created by DD-Indeed


Known Problems: 
 a)FreeFall Arena the AI drives directly into the center drop point.  The code for avoiding the center has not been moved to the new AI file yet.  
 b)Racing scenario's AI is slow.  This will be addressed in a future update. 
 c)Welding - Sometimes not working if duplicate nodes are found.
 

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



