local MSC_PART_REF = gui.Reference( "MISC", "ENHANCEMENT", "Hitmarkers" );

local AWTF2Hitsound = gui.Checkbox( MSC_PART_REF, "lua_customhitmarkersound", "TF2 Hitsound", 0 );

local function TF2Hitsound( Event )

	if AWTF2Hitsound:GetValue() then

		if gui.GetValue( "msc_hitmarker_enable" ) then
			gui.SetValue( "msc_hitmarker_volume", 0 );
		end

		if ( Event:GetName() == "player_hurt" ) then

			local ME = client.GetLocalPlayerIndex();

			local INT_UID = Event:GetInt( "userid" );
			local INT_ATTACKER = Event:GetInt( "attacker" );

			local NAME_Victim = client.GetPlayerNameByUserID( INT_UID );
			local INDEX_Victim = client.GetPlayerIndexByUserID( INT_UID );

			local NAME_Attacker = client.GetPlayerNameByUserID( INT_ATTACKER );
			local INDEX_Attacker = client.GetPlayerIndexByUserID( INT_ATTACKER );

			if ( INDEX_Attacker == ME and INDEX_Victim ~= ME ) then
				client.Command( "play Hitsound_retro1.wav", true );
			   --[[ https://wiki.teamfortress.com/w/images/5/59/Hitsound_retro1.wav --]]	
				
			end
	 
		end
	
	end

end

client.AllowListener( "player_hurt" );

callbacks.Register( "FireGameEvent", "TF2 Hitsound", TF2Hitsound );
