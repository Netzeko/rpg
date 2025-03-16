class Language{
	constructor(lang){
		switch(lang){
			case 'English':
				this._lang = new EnglishLanguage();
				this.lang = 'English';
				break;
			case 'French':
				this._lang = new FrenchLanguage();
				this.lang = 'French';
				break;
			default:
				this._lang = new EnglishLanguage();
				this.lang = 'English';
		}
	}
	text(vartrad,firstupper){
		if(this._lang['var_'+vartrad]){
			if(firstupper){
				return this._lang['var_'+vartrad][0].toUpperCase()+this._lang['var_'+vartrad].slice(1);
			}else{
				return this._lang['var_'+vartrad];
			}
		}else{
			return 'NOTEXT';
		}
	}
}

class FrenchLanguage{
	constructor(){
		this.var_strength = 'force';
		this.var_constitution = 'constitution';
		this.var_dexterity = 'dextérité';
		this.var_perception = 'perception';
		this.var_spirit = 'volonté';
		this.var_wisdom = 'sagesse';
		this.var_luck = 'chance';
		this.var_speed = 'vitesse';
		
		this.var_yes = 'oui';
		this.var_no = 'non';
		
		this.var_name = 'nom';
		this.var_level = 'niveau';
		this.var_health = 'santé';
		this.var_endurance = 'endurance';
		this.var_mana = 'mana';
		this.var_mind = 'esprit';
		
		
		this.var_charandskills = 'caractéristiques & compétences';
		this.var_equipment = 'équipement';
		this.var_prio = 'directives';
		
		this.var_headgear = 'casque';
		this.var_armor = 'plastron';
		this.var_gloves = 'gants';
		this.var_belt = 'ceinture';
		this.var_pants = 'pantalon';
		this.var_boots = 'bottes';
		this.var_rhand = 'main droite';
		this.var_lhand = 'main gauche';
		this.var_necklace = 'collier';
		this.var_bracelet = 'bracelet';
		this.var_ring = 'anneau';
		
		this.var_if = 'si';
		this.var_have = 'a';
		this.var_do = 'utiliser';
		this.var_on = 'sur';
		this.var_oneenn = 'au moins un ennemi';
		this.var_allenn = 'tous les ennemis';
		this.var_tarennn = 'ennemi ciblé';
		this.var_oneally = 'au moins un allié';
		this.var_allally = 'tous les alliés';
		this.var_tarally = 'allié ciblé';
		this.var_selft = 'personnage lui-même';
		this.var_dead = 'mort';
		this.var_atrue = 'existe';
		
		this.var_stdatt = 'attaque standard';
		this.var_nothing = 'rien';
		
		this.var_condtar = 'cible de la condition';
		this.var_randenn = 'ennemi au hasard';
		this.var_randally = 'allié au hasard';
		this.var_add = 'ajouter';
		this.var_update = 'modifier';
		
		this.var_closeddoor = 'une porte fermée';
		this.var_open = 'ouvrir';
		this.var_doorneedkey = 'cette porte nécessite une clé pour être ouverte';
		this.var_unableopen = 'vous n\'arrivez pas à l\'ouvrir';
		
		this.var_coordinates = 'coordonnées';
		this.var_depth = 'profondeur';
		this.var_area = 'zone';
		
		this.var_level_underground = 'sous-terrains';
		this.var_level_sewers = 'égouts';

		this.var_wantsomepotion = 'voulez-vous quelques potions ?';
		this.var_takecare = 'prenez soin de vous.';
		this.var_ineedmoney = 'quelques pièces pour un pauvre mendiant';
		this.var_give50 = 'donner 50 pièces d\'or';
		this.var_thankyou = 'merci.';
		this.var_needsomething = 'besoin de quelque chose ?';

		this.var_potent = 'puissance';
		this.var_cost = 'cout';
		this.var_skillAttackname = 'attaque';
		this.var_skillAttackdesc = 'l\'attaque physique de base';
		this.var_skillUseItemname = 'utiliser objet';
		this.var_skillUseItemdesc = 'utilise l\'objet sélectionné';
		this.var_skillHealname = 'soin';
		this.var_skillHealdesc = 'restaure un peu la santé';
		this.var_skillFireboltname = 'flammèche';
		this.var_skillFireboltdesc = 'inflige de faibles dégâts de feu';
		this.var_skillBurnname = 'brulure';
		this.var_skillBurndesc = 'brule l\'ennemi pendant quelques secondes';
		this.var_skillFirePillarname = 'colonne de feu';
		this.var_skillFirePillardesc = 'immole la cible dans une colonne enflammée et la brule';
		this.var_skillFireBarriername = 'barrière de feu';
		this.var_skillFireBarrierdesc = 'réduit la puissance des sorts de feu dirigés contre vous';
		this.var_skillFireBasicsname = 'apprentissage du feu';
		this.var_skillFireBasicsdesc = 'permet de débloquer les sorts de feu basiques';
		this.var_skillFireAdvancedname = 'manipulation du feu';
		this.var_skillFireAdvanceddesc = 'permet de débloquer les sorts de feu avancés';
		this.var_skillEndoFirename = 'arme enflammée';
		this.var_skillEndoFiredesc = 'ajoute des dégâts de feu aux attaques physiques';
		this.var_skillFireballname = 'boule de feu';
		this.var_skillFireballdesc = 'un projectile de feu explosant au contact';
		this.var_skillFireRainname = 'pluie de feu';
		this.var_skillFireRaindesc = 'une pluie de projectiles enflammé s\'abat sur les ennemis';
		this.var_skillExplosionname = 'explosion';
		this.var_skillExplosiondesc = 'consomme tout le mana de l\'utilisateur pour produire une formidable explosion touchant tous les ennemis';
		
		this.var_buttonstatus = 'statut';
		this.var_buttonequip = 'équipement';
		this.var_buttonorders = 'instructions';
		this.var_buttonskills = 'compétences';

		this.var_houseinn = 'auberge';
		this.var_housechurch = 'église';
		this.var_housealchemist = 'alchimiste';
		this.var_houseblacksmith = 'forgeron';
		this.var_backtovillage = 'retour au village';
		this.var_resurrect = 'ressusciter';
		this.var_save = 'sauvegarder';
		this.var_accessgounderground = 'explorer les sous-terrains';
		
		this.var_hire = 'embaucher';
		this.var_dismiss = 'renvoyer';
	}
}



class EnglishLanguage{
	constructor(){
		this.var_strength = 'strength';
		this.var_constitution = 'constitution';
		this.var_dexterity = 'dexterity';
		this.var_perception = 'perception';
		this.var_spirit = 'spirit';
		this.var_wisdom = 'wisdom';
		this.var_luck = 'luck';
		this.var_speed = 'speed';
		
		this.var_yes = 'yes';
		this.var_no = 'no';
		
		this.var_name = 'name';
		this.var_level = 'level';
		this.var_health = 'health';
		this.var_endurance = 'stamina';
		this.var_mana = 'mana';
		this.var_mind = 'mind';
		
		
		this.var_charandskills = 'characteristics & skills';
		this.var_equipment = 'equipment';
		this.var_prio = 'orders';
		
		this.var_headgear = 'headgear';
		this.var_armor = 'armor';
		this.var_gloves = 'gloves';
		this.var_belt = 'belt';
		this.var_pants = 'pants';
		this.var_boots = 'boots';
		this.var_rhand = 'right hand';
		this.var_lhand = 'left hand';
		this.var_necklace = 'necklace';
		this.var_bracelet = 'bracelet';
		this.var_ring = 'ring';
		
		this.var_if = 'if';
		this.var_have = 'have';
		this.var_do = 'do';
		this.var_on = 'on';
		this.var_oneenn = 'at least one ennemy';
		this.var_allenn = 'all the ennemies';
		this.var_tarennn = 'targeted ennemy';
		this.var_oneally = 'at least one ally';
		this.var_allally = 'all the allies';
		this.var_tarally = 'targeted ally';
		this.var_selft = 'self';
		this.var_dead = 'dead';
		this.var_atrue = 'exists';
		
		this.var_stdatt = 'standard attack';
		this.var_nothing = 'nothing';
		
		this.var_condtar = 'condition target';
		this.var_randenn = 'random ennemy';
		this.var_randally = 'random ally';
		this.var_add = 'add';
		this.var_update = 'update';
		
		this.var_closeddoor = 'a closed door';
		this.var_open = 'open';
		this.var_doorneedkey = 'this door need a key to be opened';
		this.var_unableopen = 'you are unable to open it';

		this.var_coordinates = 'coordinates';
		this.var_depth = 'depth';
		this.var_area = 'area';
		
		this.var_level_underground = 'undergrounds';
		this.var_level_sewers = 'sewers';
		
		this.var_wantsomepotion = 'want some potions ?';
		this.var_takecare = 'take care.';
		this.var_ineedmoney = 'a few coins for a lonely beggar';
		this.var_give50 = 'give 50 gold';
		this.var_thankyou = 'thank you.';
		this.var_needsomething = 'do you need something ?';
	}
}