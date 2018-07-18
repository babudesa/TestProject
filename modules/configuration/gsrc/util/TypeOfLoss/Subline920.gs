package util.TypeOfLoss;

class Subline920
{
  construct()
  {
  }
  
  public static function returnList(codeList : List, exposure : Exposure) {
    //var riskState : State = util.TypeOfLoss.helperFunctions.getRiskState( exposure )
    //var lossLocation : LossLocation = exposure.LossLocationExt
    
    switch(exposure.LossLocationExt){
      //Insured's Premises
      case "1":
        if(exposure.Coverage.State=="TX"){
          codeList.add( TypeOfLossExt.TC_13_00342 ) //13 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_17_00352 ) //17 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_1A_00285 ) //1A - Explosion
          codeList.add( TypeOfLossExt.TC_11_00070 ) //11 - Fire and Lightning
          codeList.add( TypeOfLossExt.TC_18_00271 ) //18 - Flood
          codeList.add( TypeOfLossExt.TC_1E_00293 ) //1E - Freezing
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_1C_00317 ) //1C - Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_1B_00309 ) //1B - Smoke
          codeList.add( TypeOfLossExt.TC_1D_00301 ) //1D - Sprinkler Leakage
          codeList.add( TypeOfLossExt.TC_15_00376 ) //15 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_16_00325 ) //16 - Vandalism and Malicious Mischief
          codeList.add( TypeOfLossExt.TC_14_00360 ) //14 - Water Damage (excluding Flood, Sprinkler Leakage and Freezing) including Backup of Sewers and Drains
          codeList.add( TypeOfLossExt.TC_12_00250 ) //12 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_19_00009 ) //19 - All Other
        } else {
          codeList.add( TypeOfLossExt.TC_13_00342 ) //13 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_17_00352 ) //17 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_11_00258 ) //11 - Fire, Lightning, Explosion and Smoke
          codeList.add( TypeOfLossExt.TC_18_00271 ) //18 - Flood
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_15_00376 ) //15 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_16_00334 ) //16 - Vandalism, Malicious Mischief, Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_14_00368 ) //14 - Water Damage (excluding Flood) including Backup of Sewers and Drains, Sprinkler Leakage and Freezing
          codeList.add( TypeOfLossExt.TC_12_00250 ) //12 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_19_00009 ) //19 - All Other
        }
        break;
      //Premises of Others
      case "2":
        if(exposure.Coverage.State=="TX"){
          codeList.add( TypeOfLossExt.TC_23_00343 ) //23 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_27_00353 ) //27 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_2A_00286 ) //2A - Explosion
          codeList.add( TypeOfLossExt.TC_21_00071 ) //21 - Fire and Lightning
          codeList.add( TypeOfLossExt.TC_28_00272 ) //28 - Flood
          codeList.add( TypeOfLossExt.TC_2E_00294 ) //2E - Freezing
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_2C_00318 ) //2C - Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_2B_00310 ) //2B - Smoke
          codeList.add( TypeOfLossExt.TC_2D_00302 ) //2D - Sprinkler Leakage
          codeList.add( TypeOfLossExt.TC_25_00377 ) //25 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_26_00326 ) //26 - Vandalism and Malicious Mischief
          codeList.add( TypeOfLossExt.TC_24_00361 ) //24 - Water Damage (excluding Flood, Sprinkler Leakage and Freezing) including Backup of Sewers and Drains
          codeList.add( TypeOfLossExt.TC_22_00251 ) //22 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_29_00010 ) //29 - All Other
        } else {
          codeList.add( TypeOfLossExt.TC_23_00343 ) //23 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_27_00353 ) //27 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_21_00259 ) //21 - Fire, Lightning, Explosion and Smoke
          codeList.add( TypeOfLossExt.TC_28_00272 ) //28 - Flood
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_25_00377 ) //25 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_26_00335 ) //26 - Vandalism, Malicious Mischief, Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_24_00369 ) //24 - Water Damage (excluding Flood) including Backup of Sewers and Drains, Sprinkler Leakage and Freezing
          codeList.add( TypeOfLossExt.TC_22_00251 ) //22 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_29_00010 ) //29 - All Other
        }
        break;
      //In Transit - Railroad
      case "3":
        if(exposure.Coverage.State=="TX"){
          codeList.add( TypeOfLossExt.TC_33_00344 ) //33 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_37_00354 ) //37 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_3A_00287 ) //3A - Explosion
          codeList.add( TypeOfLossExt.TC_31_00072 ) //31 - Fire and Lightning
          codeList.add( TypeOfLossExt.TC_38_00273 ) //38 - Flood
          codeList.add( TypeOfLossExt.TC_3E_00295 ) //3E - Freezing
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_3C_00319 ) //3C - Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_3B_00311 ) //3B - Smoke
          codeList.add( TypeOfLossExt.TC_3D_00303 ) //3D - Sprinkler Leakage
          codeList.add( TypeOfLossExt.TC_35_00378 ) //35 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_36_00327 ) //36 - Vandalism and Malicious Mischief
          codeList.add( TypeOfLossExt.TC_34_00362 ) //34 - Water Damage (excluding Flood, Sprinkler Leakage and Freezing) including Backup of Sewers and Drains
          codeList.add( TypeOfLossExt.TC_32_00252 ) //32 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_39_00279 ) //39 - All Other
        } else {
          codeList.add( TypeOfLossExt.TC_33_00344 ) //33 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_37_00354 ) //37 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_31_00260 ) //31 - Fire, Lightning, Explosion and Smoke
          codeList.add( TypeOfLossExt.TC_38_00273 ) //38 - Flood
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_35_00378 ) //35 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_36_00336 ) //36 - Vandalism, Malicious Mischief, Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_34_00370 ) //34 - Water Damage (excluding Flood) including Backup of Sewers and Drains, Sprinkler Leakage and Freezing
          codeList.add( TypeOfLossExt.TC_32_00252 ) //32 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_39_00279 ) //39 - All Other
        }
        break;
      //In Transit - Surface Mail
      case "4":
        if(exposure.Coverage.State=="TX"){
          codeList.add( TypeOfLossExt.TC_43_00345 ) //43 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_47_00355 ) //47 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_4A_00288 ) //4A - Explosion
          codeList.add( TypeOfLossExt.TC_41_00253 ) //41 - Fire and Lightning
          codeList.add( TypeOfLossExt.TC_48_00274 ) //48 - Flood
          codeList.add( TypeOfLossExt.TC_4E_00296 ) //4E - Freezing
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_4C_00320 ) //4C - Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_4B_00312 ) //4B - Smoke
          codeList.add( TypeOfLossExt.TC_4D_00304 ) //4D - Sprinkler Leakage
          codeList.add( TypeOfLossExt.TC_45_00379 ) //45 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_46_00328 ) //46 - Vandalism and Malicious Mischief
          codeList.add( TypeOfLossExt.TC_44_00363 ) //44 - Water Damage (excluding Flood, Sprinkler Leakage and Freezing) including Backup of Sewers and Drains
          codeList.add( TypeOfLossExt.TC_42_00266 ) //42 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_49_00280 ) //49 - All Other
        } else {
          codeList.add( TypeOfLossExt.TC_43_00345 ) //43 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_47_00355 ) //47 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_41_00261 ) //41 - Fire, Lightning, Explosion and Smoke
          codeList.add( TypeOfLossExt.TC_48_00274 ) //48 - Flood
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_45_00379 ) //45 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_46_00337 ) //46 - Vandalism, Malicious Mischief, Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_44_00371 ) //44 - Water Damage (excluding Flood) including Backup of Sewers and Drains, Sprinkler Leakage and Freezing
          codeList.add( TypeOfLossExt.TC_42_00266 ) //42 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_49_00280 ) //49 - All Other
        }
        break;
      //In Transit - Motor Vehicles
      case "5":
        if(exposure.Coverage.State=="TX"){
          codeList.add( TypeOfLossExt.TC_53_00346 ) //53 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_57_00356 ) //57 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_5A_00289 ) //5A - Explosion
          codeList.add( TypeOfLossExt.TC_51_00254 ) //51 - Fire and Lightning
          codeList.add( TypeOfLossExt.TC_58_00275 ) //58 - Flood
          codeList.add( TypeOfLossExt.TC_5E_00297 ) //5E - Freezing
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_5C_00321 ) //5C - Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_5B_00313 ) //5B - Smoke
          codeList.add( TypeOfLossExt.TC_5D_00305 ) //5D - Sprinkler Leakage
          codeList.add( TypeOfLossExt.TC_55_00380 ) //55 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_56_00329 ) //56 - Vandalism and Malicious Mischief
          codeList.add( TypeOfLossExt.TC_54_00364 ) //54 - Water Damage (excluding Flood, Sprinkler Leakage and Freezing) including Backup of Sewers and Drains
          codeList.add( TypeOfLossExt.TC_52_00267 ) //52 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_59_00281 ) //59 - All Other
        } else {
          codeList.add( TypeOfLossExt.TC_53_00346 ) //53 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_57_00356 ) //57 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_51_00262 ) //51 - Fire, Lightning, Explosion and Smoke
          codeList.add( TypeOfLossExt.TC_58_00275 ) //58 - Flood
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_55_00380 ) //55 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_56_00338 ) //56 - Vandalism, Malicious Mischief, Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_54_00372 ) //54 - Water Damage (excluding Flood) including Backup of Sewers and Drains, Sprinkler Leakage and Freezing
          codeList.add( TypeOfLossExt.TC_52_00267 ) //52 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_59_00281 ) //59 - All Other
        }
        break;
      //In Transit - Air/Waterborne
      case "6":
        if(exposure.Coverage.State=="TX"){
          codeList.add( TypeOfLossExt.TC_63_00347 ) //63 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_67_00357 ) //67 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_6A_00290 ) //6A - Explosion
          codeList.add( TypeOfLossExt.TC_61_00255 ) //61 - Fire and Lightning
          codeList.add( TypeOfLossExt.TC_68_00276 ) //68 - Flood
          codeList.add( TypeOfLossExt.TC_6E_00298 ) //6E - Freezing
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_6C_00322 ) //6C - Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_6B_00314 ) //6B - Smoke
          codeList.add( TypeOfLossExt.TC_6D_00306 ) //6D - Sprinkler Leakage
          codeList.add( TypeOfLossExt.TC_65_00381 ) //65 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_66_00330 ) //66 - Vandalism and Malicious Mischief
          codeList.add( TypeOfLossExt.TC_64_00365 ) //64 - Water Damage (excluding Flood, Sprinkler Leakage and Freezing) including Backup of Sewers and Drains
          codeList.add( TypeOfLossExt.TC_62_00268 ) //62 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_69_00282 ) //69 - All Other
        } else {
          codeList.add( TypeOfLossExt.TC_63_00347 ) //63 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_67_00357 ) //67 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_61_00263 ) //61 - Fire, Lightning, Explosion and Smoke
          codeList.add( TypeOfLossExt.TC_68_00276 ) //68 - Flood
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_65_00381 ) //65 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_66_00339 ) //66 - Vandalism, Malicious Mischief, Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_64_00373 ) //64 - Water Damage (excluding Flood) including Backup of Sewers and Drains, Sprinkler Leakage and Freezing
          codeList.add( TypeOfLossExt.TC_62_00268 ) //62 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_69_00282 ) //69 - All Other          
        }
        break;
      //In Transit - Messengers/Salesmen
      case "8":
        if(exposure.Coverage.State=="TX"){
          codeList.add( TypeOfLossExt.TC_83_00349 ) //83 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_87_00359 ) //87 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_8A_00292 ) //8A - Explosion
          codeList.add( TypeOfLossExt.TC_81_00257 ) //81 - Fire and Lightning
          codeList.add( TypeOfLossExt.TC_88_00278 ) //88 - Flood
          codeList.add( TypeOfLossExt.TC_8E_00300 ) //8E - Freezing
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_8C_00324 ) //8C - Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_8B_00316 ) //8B - Smoke
          codeList.add( TypeOfLossExt.TC_8D_00308 ) //8D - Sprinkler Leakage
          codeList.add( TypeOfLossExt.TC_85_00383 ) //85 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_86_00332 ) //86 - Vandalism and Malicious Mischief
          codeList.add( TypeOfLossExt.TC_84_00367 ) //84 - Water Damage (excluding Flood, Sprinkler Leakage and Freezing) including Backup of Sewers and Drains
          codeList.add( TypeOfLossExt.TC_82_00270 ) //82 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_89_00284 ) //89 - All Other
        } else {
          codeList.add( TypeOfLossExt.TC_83_00349 ) //83 - Breakage, Collision, Upset, Overturn, Derailment, Dropping, Sinking, Spoilage and Corrosion
          codeList.add( TypeOfLossExt.TC_87_00359 ) //87 - Collapse, Volcanic Action, Earth Movement, i.e. Subsidence, Landslide, Earthquake, etc.
          codeList.add( TypeOfLossExt.TC_81_00265 ) //81 - Fire, Lightning, Explosion and Smoke
          codeList.add( TypeOfLossExt.TC_88_00278 ) //88 - Flood
          codeList.add( TypeOfLossExt.TC_99_00351 ) //99 - Losses Due to Acts of Terrorism certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_98_00350 ) //98 - Losses Due to Acts of Terrorism not certified under the Terrorism Risk Insurance Act
          codeList.add( TypeOfLossExt.TC_85_00383 ) //85 - Theft, Burglary, Robbery, Extortion incl. Hijacking, Mysterious Disappearance, Pilferage and Shortage
          codeList.add( TypeOfLossExt.TC_86_00341 ) //86 - Vandalism, Malicious Mischief, Riot and Civil Commotion
          codeList.add( TypeOfLossExt.TC_84_00375 ) //84 - Water Damage (excluding Flood) including Backup of Sewers and Drains, Sprinkler Leakage and Freezing
          codeList.add( TypeOfLossExt.TC_82_00270 ) //82 - Wind and Hail
          codeList.add( TypeOfLossExt.TC_89_00284 ) //89 - All Other
        }
        break;
      default:
        break;
    }
  }
}
