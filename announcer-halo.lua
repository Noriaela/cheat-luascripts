killStreakTimeout = 4 -- Halo specs.

killstreak = 0;
killcount = 0;
lastKillTime = 0;

function Sounds( Event, Entity )
	
	if ( Event:GetName() == 'player_death' ) then
		
		local ME = client.GetLocalPlayerIndex();
		
		local INT_UID = Event:GetInt( 'userid' );
		local INT_ATTACKER = Event:GetInt( 'attacker' );
		
		local NAME_Victim = client.GetPlayerNameByUserID( INT_UID );
		local INDEX_Victim = client.GetPlayerIndexByUserID( INT_UID );
		
		local NAME_Attacker = client.GetPlayerNameByUserID( INT_ATTACKER );
		local INDEX_Attacker = client.GetPlayerIndexByUserID( INT_ATTACKER );
		
		if ( INDEX_Attacker == ME and INDEX_Victim ~= ME ) then
			killcount = killcount + 1;
			killstreak = killstreak + 1;
			if ((globals.RealTime() - lastKillTime) < (killStreakTimeout)) then
				if ( killstreak == 2 ) then
					client.Command("play halo\\multi2.wav", true);
				elseif ( killstreak == 3) then
					client.Command("play halo\\multi3.wav", true);
				elseif ( killstreak == 4) then
					client.Command("play halo\\multi4.wav", true);
				elseif ( killstreak == 5) then
					client.Command("play halo\\multi5.wav", true);
				elseif ( killstreak == 6) then
					client.Command("play halo\\multi6.wav", true);
				elseif ( killstreak == 7) then
					client.Command("play halo\\multi7.wav", true);
				elseif ( killstreak == 8) then
					client.Command("play halo\\multi8.wav", true);
				elseif ( killstreak == 9) then
					client.Command("play halo\\multi9.wav", true);
				elseif ( killstreak >= 10) then -- 10 or more kills plays same sound every time.
					client.Command("play halo\\multi10.wav", true);
				end
			else
				-- This scenario is when you kill someone outside the killStreakTimeout variable.
				killstreak = 1; 
			end
			
			if ( killcount > 0 ) then
				if ( killcount == 5 ) then
					client.Command("playvol halo\\streak5.wav 1", true);
				elseif ( killcount == 10 ) then 
					client.Command("playvol halo\\streak10.wav 1", true);
				elseif ( killcount == 15 ) then 
					client.Command("playvol halo\\streak15.wav 1", true);
				elseif ( killcount == 20 ) then 
					client.Command("playvol halo\\streak20.wav 1", true);
				elseif ( killcount == 25 ) then 
					client.Command("playvol halo\\streak25.wav1", true);
				elseif ( killcount == 30 ) then 
					client.Command("playvol halo\\streak30.wav 1", true);
				elseif ( killcount == 35 ) then 
					client.Command("playvol halo\\streak35.wav 1", true);
				elseif ( killcount % 5 == 0 ) then  -- play sound every 5 kills
					client.Command("playvol halo\\streak40.wav 1", true);
				end
			-- update time of last killed player at the end
			lastKillTime = globals.RealTime()
			end
		end
		
		if ( INDEX_Victim == ME ) then
			killstreak = 0;
			killcount = 0;
		end
	end
end

client.AllowListener( 'player_death' );
callbacks.Register( 'FireGameEvent', 'Announcer', Sounds );