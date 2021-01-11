package github.souchy.ankama.dofusbuilder.excluded.jade;

public enum ItemCategory {
	
	Chapeau(0),
	Cape(1),
	Sac(1),
	Ceinture(2),
	Bottes(3),
	Amulette(4),
	Anneau(5),
	
	Arme(6),
	Arc(6),
	Baguette(6),
	Épée(6),
	Marteau(6),
	Pelle(6),
	Bâton(6),
	Faux(6),
	Hache(6),
	Dagues(6),
	Pioche(6),
	
	Bouclier(7),
	
	Dofus(8),
	Trophée(8),
	
	Familier(9),
	Dragodinde(9),
	Volkorne(9),
	Muldo(9),
	
	;
	
	public int id;
	private ItemCategory(int id) {
		this.id = id;
	}
	
}
