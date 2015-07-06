/**
 * Created by greg on 05/03/15.
 */

var Container = {};
var Palette = [];
var camera ={};
var ordre = [];
var pas = {};
var e_pause = false;
var pause = function() {
    e_pause = !e_pause;
}


var taille = [];
taille[0] = {};
taille[0].longueur = 120;
taille[0].largeur = 80;
taille[1] = {};
taille[1].longueur = 80;
taille[1].largeur = 60;
taille[2] = {};
taille[2].longueur = 240;
taille[2].largeur = 80;

var hauteur = [];
hauteur[0] = 50;
hauteur[1] = 120;
hauteur[2] = 200;

function start() {
    Events.InitializeEvents();
    var canvas = document.getElementById("renderingCanvas");

    camera = new Camera({
        pos: {x: -2500, y: 1000, z: 2500},
        target: {x: 0, y: 0, z: 0},
        fov: Math.PI / 3,
        aspectRatio: canvas.width / canvas.height,
        near: 1.0,
        far: 100000.0
    });


    var glParams = {
        alpha: false,
        depth: true,
        stencil: false,
        antialias: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        preferLowPowerToHighPerformance: false,
        failIfMajorPerformanceCaveat: false
    };

    init_container();
    init_palette();
    denominateur();
    init_ordre();

    var renderer = new Renderer(canvas, glParams);
    camera.bindCommands(renderer.keyboardManager);

    var depthTarget = new RenderTarget(canvas.width, canvas.height, true, false);

    var quad = new Mesh();
    quad._positions.push(-1, 1, 0, -1, -1, 0, 1, -1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0);
    var outlineMat = new Material("outline", "data/shader/renderTexture.vShader", "data/shader/outline.fShader",
        function (mat) {
            mat.uniforms["texture0"].texture = depthTarget;
            mat.uniforms["invScreenSize"].value = vec2.fromValues(1 / canvas.width, 1 / canvas.height);
        });
    outlineMat.zWrite = false;
    outlineMat.zTest = false;
    outlineMat.blendEquation = GL.FUNC_ADD;

    var screenQuad = new Object3D(quad, outlineMat);
    var depthMat = new Material("depth", "data/shader/depth.vShader", "data/shader/depth.fShader");
    depthMat.blendEquation = false;


    function resize(size) {
        depthTarget.resize(renderer.gl, size.w, size.h);
        outlineMat.uniforms["invScreenSize"].value = vec2.fromValues(1 / size.w, 1 / size.h);
    }
    setInterval(function(){
        if(e_pause) {

        }
    }, 2000);

    function render(deltaTime) {
        renderer.setCamera(camera);

        renderer.setRenderTarget(depthTarget);
        renderer.clear({r: 0.31, g: 0.59, b: 0.78, a: 1.0});

        renderer.renderObject(Container.Object, depthMat);

        for(var i in Palette) {
            renderer.renderObject(Palette[i].Object, depthMat);
        }
        //renderer.renderObject(Palette[0].Object, depthMat);

        renderer.setRenderTarget(null);
        renderer.clear({r: 0.31, g: 0.59, b: 0.78, a: 1.0});

        for(var i in Palette) {
            renderer.renderObject(Palette[i].Object);
        }
        renderer.renderObject(screenQuad, outlineMat);

    }

    Events.AddEventListener(Events.onRender, render);
    Events.FireEvent(Events.onRender);
}

var init_container = function() {
    Container.largeur = 240;
    Container.longueur = 1200;
    Container.hauteur = 270;

    Container.Mesh = new Mesh("Container");
    Container.Mesh.loadFromObjFile("data/cube.obj");
    Container.Mat = new Material("Container", "data/shader/default.vShader", "data/shader/default.fShader",
        function (mat) {
            var texture = new Texture("data/grass_diffuse.png");
            mat.uniforms["texture0"].texture = texture;
        });
    Container.Mat.blendEquation = GL.FUNC_ADD;
    Container.Mat.dstBlend = GL.ONE;
    Container.Mat.srcBlend = GL.ONE;
    Container.Object = new Object3D(Container.Mesh, Container.Mat);
    Container.Object.setScale(Container.longueur*1,Container.hauteur*1,Container.largeur*1);

    Container.Object.setPosition(Container.longueur,Container.hauteur,Container.largeur);
    Container.Object.setRotation(0,0,0);


    Container.tab = [];
}

var init_palette = function() {

    var tmp = {};
    tmp.Mesh = new Mesh("palette");
    tmp.Mesh.loadFromObjFile("data/cube.obj");

    tmp.Mat = [];

    tmp.Mat[0] = new Material("palette", "data/shader/default.vShader", "data/shader/default.fShader",
        function (mat) {
            var texture = new Texture("data/0.jpg");
            mat.uniforms["texture0"].texture = texture;
        });
    tmp.Mat[0].blendEquation = GL.FUNC_ADD;
    tmp.Mat[0].dstBlend = GL.ONE;
    tmp.Mat[0].srcBlend = GL.ONE;

    tmp.Mat[1] = new Material("palette", "data/shader/default.vShader", "data/shader/default.fShader",
        function (mat) {
            var texture = new Texture("data/1.jpg");
            mat.uniforms["texture0"].texture = texture;
        });
    tmp.Mat[1].blendEquation = GL.FUNC_ADD;
    tmp.Mat[1].dstBlend = GL.ONE;
    tmp.Mat[1].srcBlend = GL.ONE;
    tmp.Mat[2] = new Material("palette", "data/shader/default.vShader", "data/shader/default.fShader",
        function (mat) {
            var texture = new Texture("data/3.jpg");
            mat.uniforms["texture0"].texture = texture;
        });
    tmp.Mat[2].blendEquation = GL.FUNC_ADD;
    tmp.Mat[2].dstBlend = GL.ONE;
    tmp.Mat[2].srcBlend = GL.ONE;
    tmp.Mat[3] = new Material("palette", "data/shader/default.vShader", "data/shader/default.fShader",
        function (mat) {
            var texture = new Texture("data/4.jpg");
            mat.uniforms["texture0"].texture = texture;
        });
    tmp.Mat[3].blendEquation = GL.FUNC_ADD;
    tmp.Mat[3].dstBlend = GL.ONE;
    tmp.Mat[3].srcBlend = GL.ONE;


    tmp.Mat[4] = new Material("palette", "data/shader/default.vShader", "data/shader/default.fShader",
        function (mat) {
            var texture = new Texture("data/0.jpg");
            mat.uniforms["texture0"].texture = texture;
        });
    tmp.Mat[4].blendEquation = GL.FUNC_ADD;
    tmp.Mat[4].dstBlend = GL.ONE;
    tmp.Mat[4].srcBlend = GL.ONE;


    tmp.Mat[5] = new Material("palette", "data/shader/default.vShader", "data/shader/default.fShader",
        function (mat) {
            var texture = new Texture("data/1.jpg");
            mat.uniforms["texture0"].texture = texture;
        });
    tmp.Mat[5].blendEquation = GL.FUNC_ADD;
    tmp.Mat[5].dstBlend = GL.ONE;
    tmp.Mat[5].srcBlend = GL.ONE;



    for(var i in taille) {
        taille[i].array_longueur = [];
        for(var j = 0; j < taille[i].longueur ; j++) {
            taille[i].array_longueur.push(true);
        }
    }

    var l = 0;
    for(var i = 0; i <6; i++) {
        for(var j in taille) {
            for(var k in hauteur) {
                Palette[l] = {};
                Palette[l].largeur = taille[j].largeur;
                Palette[l].longueur = taille[j].longueur;
                Palette[l].hauteur = hauteur[k];
                Palette[l].array_longueur = taille[j].array_longueur;
                Palette[l].priority = i+1;
                Palette[l].Object = new Object3D(tmp.Mesh, tmp.Mat[i]);
                Palette[l].Object.setScale(Palette[l].longueur*0.9,Palette[l].hauteur*0.9,Palette[l].largeur*0.9);
                Palette[l].Object.setPosition(Math.random()*10000-5000,0,Math.random()*10000-5000);
                Palette[l].Object.setRotation(0,0,0);
                l++;
            }
        }
    }
}

var init_ordre = function() {
    genetique.init();
}

var denominateur = function() {
    var tmp = [];
    for(var i in taille) {
        tmp.push(taille[i].largeur);
        tmp.push(taille[i].longueur);
    }
    tmp.sort(function(a,b){return b-a});

    var div = tmp[0]+1;
    var f = true;

    while(f) {
        div--;
        f = tmp.length;
        for(var i in tmp) {
            if(tmp[i]%div == 0) {
                f--;
            } else {
                break;
            }
        }
    }
    pas.x = div;
    pas.z = div;

    hauteur.sort(function(a,b){return b-a});

    var div = hauteur[0]+1;
    var f = true;

    while(f) {
        div--;
        f = hauteur.length;
        for(var i in tmp) {
            if(hauteur[i]%div == 0) {
                f--;
            } else {
                break;
            }
        }
    }
    pas.y = div;
}