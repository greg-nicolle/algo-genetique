/**
 * Created by greg on 20/03/15.
 */

var genetique = {};
genetique.tmp = [];
genetique.best = [];
genetique.nbmutation = 1;
genetique.nbcroisement = 20;
genetique.old = [];
genetique.scrore = [];
genetique.pcroisement = 50;

genetique.chromosobe = [];
genetique.nbchromosome = 100;
genetique.curentchromosome = 0;
genetique.curentmutation = genetique.nbmutation;
genetique.curentcroisement = genetique.nbcroisement;

genetique.mutation = function(){
    var tmp1 = Math.random()*(this.chromosobe[this.curentchromosome].length-1);
    tmp1 = Math.round(tmp1);
    var tmp2 = Math.random()*(this.chromosobe[this.curentchromosome].length-1);
    tmp2 = Math.round(tmp2);
    var b1 = true;
    var b2 = true;

    for(var i in ordre) {
        if(this.chromosobe[this.curentchromosome][i] == tmp1 && b1) {
            this.chromosobe[this.curentchromosome][i] = tmp2;
            b1 = false;
        }
        if(this.chromosobe[this.curentchromosome][i] == tmp2 && b2) {
            this.chromosobe[this.curentchromosome][i] = tmp1;
            b2 = false;
        }
    }
    ordre = this.chromosobe[this.curentchromosome];
    setTimeout(function() {
        remplissage.start()
    }, 0.1);
}

genetique.croisement = function(){

    for(var j = 0; j < this.nbchromosome/(100/this.pcroisement); j++) {

        var ccase = Math.random() * (this.chromosobe[j].length - 1);
        ccase = Math.round(ccase);

        var ach = Math.random() * (this.chromosobe[j].length - 1)/2;
        ach = Math.round(ach);
        var b1 = true;
        var b2 = true;

        this.old[j] = this.best[j];

        tmp1 = this.chromosobe[j][ccase];
        tmp2 = this.chromosobe[ach][ccase];

        for (var i in ordre) {
            if (this.chromosobe[j][i] == tmp1 && b1) {
                this.chromosobe[j+this.nbchromosome/(100/this.pcroisement)][i] = tmp2;
                b1 = false;
            }else if (this.chromosobe[j][i] == tmp2 && b2) {
                this.chromosobe[j+this.nbchromosome/(100/this.pcroisement)][i] = tmp1;
                b2 = false;
            }else {
                this.chromosobe[j+this.nbchromosome/(100/this.pcroisement)][i] = this.chromosobe[j][i];
            }
        }
    }
    remplissage.start();
}

genetique.calcul_croisement = function() {
    this.best = this.best.concat(this.old);
    this.best.sort(function(b, a){return a.score-b.score});

    for(var i in this.chromosobe) {
        //console.log(this.best[i].)
        this.chromosobe[i] = [].concat(this.best[i].cromo);
    }

    this.croisement();
}


genetique.init = function(){

    for(var j = 0; j < this.nbchromosome; j++) {
        this.chromosobe[j] = [];
        this.tmp = [];

        for (var i in Palette) {
            this.tmp.push(i);
        }

        for (var i in Palette) {
            var tmp = Math.random() * (this.tmp.length - 1);
            tmp = Math.round(tmp);
            this.chromosobe[j][i] = this.tmp[tmp];
            this.tmp = this.tmp.slice(0, tmp).concat(this.tmp.slice(tmp + 1, this.tmp.length));
        }
    }

    ordre = this.chromosobe[this.curentchromosome];

    remplissage.start();
}
var fg = true;
var tmpb = 0;

genetique.coup = function() {
    var sumb = 0;
    for(var i in remplissage.tab) {
        for(var j in remplissage.tab[i]){
            //console.log(remplissage.tab[i][j]);
            if(remplissage.tab[i][j][remplissage.tab[i][j].length - 1]) {
                var min = remplissage.tab[i][j][remplissage.tab[i][j].length - 1].p;
                for (var k = remplissage.tab[i][j].length; k > 0; k--) {
                    if (min < remplissage.tab[i][j].length) {
                        sumb++;
                    } else {
                        min = remplissage.tab[i][j].length;
                    }
                    k = remplissage.tab[i][j][k] - 1;
                }
            }
        }
    }
    sumb = (remplissage.palette_place*5)/sumb;

    var sum = 0;
    for(var i = 0; i < remplissage.palette_place; i++) {
        sum += Palette[ordre[i]].largeur*Palette[ordre[i]].longueur*Palette[ordre[i]].hauteur;
    }
    sum /= Container.largeur*Container.longueur*Container.hauteur;


    this.best[this.curentchromosome] = {};
    this.best[this.curentchromosome].score = sum;//+sumb;
    this.best[this.curentchromosome].cromo = [].concat(ordre);
    if(tmpb < sum) {
        tmpb = sum;//+sumb;
    }
}

genetique.calcul = function() {
    this.coup();
    if(--this.curentmutation) {
        this.mutation();
    } else if(this.curentchromosome < this.nbchromosome-1){
        this.curentmutation = this.nbmutation;
        this.curentchromosome++;


        this.mutation();
    } else if(--this.curentcroisement){
        console.log(this.curentcroisement+" "+tmpb);
        this.curentmutation = this.nbmutation;
        this.curentchromosome = 0;

        this.calcul_croisement();
    }
    else{
        this.best.sort(function(b, a){return a.score-b.score});
        console.log(this.best[0].score);
        console.log(tmpb);
        ordre = this.best[0].cromo;
        remplissage.aff = true;
        if(fg)remplissage.start();
        fg = false;
    }
}