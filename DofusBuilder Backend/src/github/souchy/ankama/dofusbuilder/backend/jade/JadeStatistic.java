package github.souchy.ankama.dofusbuilder.backend.jade;

public class JadeStatistic {
	
	public String name;
	public Integer min;
	public Integer max;
	
	public JadeStatistic() {
		
	}
	public JadeStatistic(String name, Integer min, Integer max) {
		this.name = name;
		this.min = min;
		this.max = max;
	}
	
}
