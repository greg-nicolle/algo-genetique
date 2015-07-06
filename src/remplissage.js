/**
 * Created by greg on 17/03/15.
 */

var remplissage = {};
remplissage.tmp_f = true;
remplissage.sem = 0;
remplissage.current_palette = 0;
remplissage.current_place = 0;
remplissage.place = [];
remplissage.tab = [];
remplissage.palette_place = 0;
remplissage.aff = false;

remplissage.free_under = function(pos,k){

    var f = true;
    if((this.place[this.current_place].y + Palette[ordre[this.current_palette]].hauteur / pas.y) < (Container.hauteur/pas.y)) {
        if (pos.y != 0) {
            if (this.tab[k]) {
                if (this.tab[k][pos.y - 1].length >= pos.x + Palette[ordre[this.current_palette]].longueur / pas.x) {
                    for (var m = pos.x; m < Palette[ordre[this.current_palette]].longueur / pas.x + pos.x; m++) {
                        if (!this.tab[k][pos.y - 1][m]) {
                            f = false;
                            break;
                        }
                    }
                } else {
                    f = false;
                }
            } else {
                f = false;
            }
        }
        if (f) {
            remplissage.new_pos(f);
        } else {
            remplissage.new_pos(false);
        }
    }
}

remplissage.free_back = function(pos,k){

    var f = true;
    if((this.place[this.current_place].z + Palette[ordre[this.current_palette]].largeur/pas.z) < this.tab.length) {
        for (var l = pos.y; l < Palette[ordre[this.current_palette]].hauteur / pas.y + pos.y; l++) {
            if (this.tab[k]) {
                if (this.tab[k][l].length != pos.x) {
                    for (var m = pos.x; m < Palette[ordre[this.current_palette]].longueur / pas.x + pos.x; m++) {
                        if (this.tab[k][l][m]  ) {
                            f = false;
                            break;
                        }
                    }
                }
            } else {
                f = false;
            }
        }
        if (f) {
            remplissage.new_pos(true);
        } else {
            remplissage.new_pos(false);
        }
    } else {
        remplissage.new_pos(false);
    }
}


remplissage.new_pos = function(input){
    this.tmp_f *= input;

    if(!--this.sem) {
        if (this.tmp_f) {

            this.palette_place++;
            var tmp = this.place[this.current_place].y;

            this.set_case(tmp);

            if(this.aff) {
                Palette[ordre[this.current_palette]].Object.setPosition(this.place[this.current_place].x * 2 * pas.x + Palette[ordre[this.current_palette]].longueur,
                    tmp * 2 * pas.y + Palette[ordre[this.current_palette]].hauteur,
                    this.place[this.current_place].z * 2 * pas.z + Palette[ordre[this.current_palette]].largeur);
            }
            this.place.push({
                x: (this.place[this.current_place].x + Palette[ordre[this.current_palette]].longueur / pas.x),
                y: tmp,
                z: this.place[this.current_place].z
            });

            this.place.push({
                x: this.place[this.current_place].x,
                y: tmp,
                z: (this.place[this.current_place].z + Palette[ordre[this.current_palette]].largeur / pas.z)
            });

            this.place[this.current_place].y += Palette[ordre[this.current_palette]].hauteur / pas.y;

            if (this.current_palette >= ordre.length-1) {
                genetique.calcul();
                return;
            } else {
                this.current_palette++;
                this.current_place = 0;

                this.begin();
            }
        } else {
            if (this.current_palette >= ordre.length-1) {
                genetique.calcul();
                return;
            } else {
                if (this.current_place < this.place.length) {
                    this.current_place++;
                } else {
                    this.current_palette++;
                    this.current_place = 0;
                }
                this.begin();
            }
        }
    }
}

remplissage.start = function() {

    this.current_palette = 0;
    this.current_place = 0;
    this.palette_place = 0;

    this.sem = 0;
    this.tmp_f = true;

    this.place = [];

    var origine = {};
    origine.x = 0;
    origine.y = 0;
    origine.z = 0;

    this.tab = [];

    for(var i = 0; i < Container.largeur/pas.z; i++) {
        this.tab[i] = [];
        for( var j = 0; j< Container.hauteur/pas.y; j++) {
            this.tab[i][j] = [];
        }
    }
    this.place[0] = origine;
    if(this.aff) {
        for (var i in Palette) {
            Palette[i].Object.setPosition(0, 10000, 0);
        }
    }

    this.begin();
}

remplissage.set_case = function(tmp) {
    for (var k = this.place[this.current_place].z;
         k < Palette[ordre[this.current_palette]].largeur / pas.z + this.place[this.current_place].z;
         k++) {

        for (var l = tmp;
             l < Palette[ordre[this.current_palette]].hauteur / pas.y + tmp;
             l++) {
            for (var m = this.place[this.current_place].x;
                 m < Palette[ordre[this.current_palette]].longueur / pas.x + this.place[this.current_place].x;
                 m++) {
                this.tab[k][l][m] = {p:Palette[ordre[this.current_palette]].priority,end:this.place[this.current_place].x};
            }
        }
    }
}

remplissage.begin = function(){
    var k;
    var tmp;
    var tmp2;
    var tmp3;
    if(this.current_palette < ordre.length-1 &&  this.place[this.current_place]) {

        if(!Palette[ordre[this.current_palette]]){
            console.log(ordre);
            console.log(this.current_palette);
        }
        this.sem = (Palette[ordre[this.current_palette]].largeur / pas.z)*2;
        tmp2 = Palette[ordre[this.current_palette]].largeur / pas.z + this.place[this.current_place].z;


        tmp = this.sem;
        tmp3 = this.place[this.current_place].z;
        this.tmp_f = true;
        if ((this.place[this.current_place].x + Palette[ordre[this.current_palette]].longueur / pas.x) < Container.longueur / pas.x) {
            if ((this.place[this.current_place].z + Palette[ordre[this.current_palette]].largeur / pas.z) < this.tab.length) {
                //console.log(this.place[this.current_place].y + Palette[ordre[this.current_palette]].hauteur / pas.y+" "+Container.hauteur/pas.y);
                if ((this.place[this.current_place].y + Palette[ordre[this.current_palette]].hauteur / pas.y) < (Container.hauteur / pas.y)) {
                    for (k = this.place[this.current_place].z; k < tmp2; k++) {

                        this.free_back(this.place[this.current_place], k);
                        this.free_under(this.place[this.current_place], k);
                    }
                } else {
                    this.current_place++;
                    this.begin();
                }
            } else {
                this.current_place++;
                this.begin();
            }
        } else {
            this.current_place++;
            this.begin();
        }
    } else {
        if(!this.aff)genetique.calcul();
    }
}