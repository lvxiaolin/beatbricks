// JavaScript Document
$(function(){
	window.game = (function($){
		var pos = [];//球的位置
		var face = [-1,1];//球的运动方向
		var speed = 100;//小球速度
		var row = 87;//游戏背景行像素
		var col = 151;//游戏背景列像素
		var arrzk = [];//砖块
		var bili = [8,14,17,19,20];//砖块颜色随即比例
		var bany;//板的位置
		var banlength;//板长
		var run;
		var score=0;
		var banmoving = 0;
		
		function rd(Min,Max){   
			var Range = Max - Min;   
			var Rand = Math.random();   
			return(Min + Math.round(Rand * Range));   
		}
		var randscore=function(){
			var num=rd(1,20);
			for(var i=0;i<bili.length;i++){
				if(bili[i]>=num){
					return (i+1)*10;
				}
			}
		}
		
		var drawtable=function(){
			var html = '<table align=center>';
			for(var i=0;i<row;i++){
				html = html+'<tr>';
				for(var j=0;j<col;j++){
					html = html+'<td></td>';
				}
				html = html+'</tr>';
			}
			html = html+'</table>';
			$("#all").append(html);
		}
		
		var makezk=function(){
			for(var i=0;i<row;i++){
				for(var j=0;j<col;j++){
					var classname = '';
					var itrue = i%2;
					var jtrue = j%3;
					if(i>6&&i<60&&j>10&&j<140&&itrue==0&&jtrue==0&&(!(20<j&&j<130&&i>10&&i<56)||(50<j&&j<100&&i>20&&i<46)&&!(55<j&&j<95&&i>26&&i<40))){
						var spe = 0;
						var zkscore = randscore();
						if(zkscore>35){
							spe = rd(0, 4);
						}
						arrzk.push([i, j, zkscore, spe]);
						classname = "zk"+zkscore;
						var tr = $("#all table tr:eq("+i+")");
						var tr1 = $("#all table tr:eq("+(i+1)+")");
						tr.children("td:eq("+j+")").addClass(classname);
						tr.children("td:eq("+(j+1)+")").addClass(classname);
						tr.children("td:eq("+(j+2)+")").addClass(classname+" border_right");
						tr1.children("td:eq("+j+")").addClass(classname+" border_bottom");
						tr1.children("td:eq("+(j+1)+")").addClass(classname+" border_bottom");
						tr1.children("td:eq("+(j+2)+")").addClass(classname+" border_bottom border_right");
					}
				}
			}
		}
		
		var removezk=function(zk){
			if(!zk) return false;
			addscore(zk);
			switch(arrzk[zk][3]){
				case 1:
					if(banlength<3)break;
					hideban();
					banlength-=2;
					showban();
					showmsg("板变短");
					setTimeout(function(){hideban();banlength+=2;showban()},5000);
					break;
				case 2:
					hideban();
					banlength+=2;
					showban();
					showmsg("板变长");
					setTimeout(function(){hideban();banlength-=2;showban()},5000);
					break;
				case 3:
					speed -= 40;
					start();
					showmsg("球加快");
					setTimeout(function(){speed += 40;;start()},5000);
					break;
				case 1:
					speed += 40;
					start();
					showmsg("球减慢");
					setTimeout(function(){speed -= 40;start()},5000);
					break;
			}
			var classname = "zk"+arrzk[zk][2];
			if(arrzk[zk][2]==50){
				var left_top = [arrzk[zk][0]-2,arrzk[zk][1]-3];
				var left = [arrzk[zk][0],arrzk[zk][1]-3];
				var left_bottom = [arrzk[zk][0]+2,arrzk[zk][1]-3];
				var bottom = [arrzk[zk][0]-2,arrzk[zk][1]];
				var right_bottom = [arrzk[zk][0]+2,arrzk[zk][1]+3];
				var right = [arrzk[zk][0],arrzk[zk][1]+3];
				var right_top = [arrzk[zk][0]-2,arrzk[zk][1]+3];
				var top = [arrzk[zk][0]-2,arrzk[zk][1]];
				removezk(inzk(left_top));
				removezk(inzk(left));
				removezk(inzk(left_bottom));
				removezk(inzk(bottom));
				removezk(inzk(right_bottom));
				removezk(inzk(right));
				removezk(inzk(right_top));
				removezk(inzk(top));
					   
			}
			var tr = $("#all table tr:eq("+arrzk[zk][0]+")");
			var tr1 = $("#all table tr:eq("+(arrzk[zk][0]+1)+")");
			tr.children("td:eq("+arrzk[zk][1]+")").removeClass(classname);
			tr.children("td:eq("+(arrzk[zk][1]+1)+")").removeClass(classname);
			tr.children("td:eq("+(arrzk[zk][1]+2)+")").removeClass(classname+" border_right");
			tr1.children("td:eq("+arrzk[zk][1]+")").removeClass(classname+" border_bottom");
			tr1.children("td:eq("+(arrzk[zk][1]+1)+")").removeClass(classname+" border_bottom");
			tr1.children("td:eq("+(arrzk[zk][1]+2)+")").removeClass(classname+" border_bottom border_right");
			arrzk[zk]=false;
			
		}
		
		var makeban=function(){
			bany = (col+1)/2;
			banlength = 5;
			showban();
		}
		
		var hideban=function(){
			var last = $("#all table tr:last");
			last.children("td:eq("+bany+")").removeClass("ban");
			for(var j=0;j<banlength;j++){
				last.children("td:eq("+(bany+j+1)+")").removeClass("ban");
				last.children("td:eq("+(bany-j-1)+")").removeClass("ban");
			}
			
		}
		
		var showban=function(){
			var last = $("#all table tr:last");
			last.children("td:eq("+bany+")").addClass("ban");
			for(var j=0;j<banlength;j++){
				last.children("td:eq("+(bany+j+1)+")").addClass("ban");
				last.children("td:eq("+(bany-j-1)+")").addClass("ban");
			}
			
		}
		
		var moveban=function(y){	
			banmoving += y;
			if(banmoving<2&&banmoving>-2){
				moveban(y);
			}
			setTimeout(function(){mb(y)},50);
			setTimeout(function(){mb(y)},100);
			setTimeout(function(){mb(y)},150);
			setTimeout(function(){mb(y);},200);
			setTimeout(function(){banmoving -= y;},600);
			
			function mb(y){
				hideban();
				bany = bany+y;
				if(bany<banlength||bany>(col-banlength)){
					bany = bany-y;
				}else if(pos[0]==(row-2)){
					hideball();
					pos[1] = pos[1] + y;
					showball();
				}
				showban();
			}
		}
		
		var hideball=function(){
			$("#all table tr:eq("+pos[0]+")").children("td:eq("+pos[1]+")").removeClass("ball");
		}
		var showball=function(){
			$("#all table tr:eq("+pos[0]+")").children("td:eq("+pos[1]+")").addClass("ball");
		}
		var moveball=function(){
			var next=[pos[0]+face[0],pos[1]+face[1]];	
			if(next[0]>row-2){
				var left = bany-banlength;
				var right = bany+banlength;
				if(next[1]>=left&&next[1]<=right){
					face[0]=-face[0];
					if(banmoving>0){
						face[1]	+= 1;
					}
					if(banmoving<0){
						face[1]	-= 1;
					}
					if(face[1]==0){
						if(banmoving>0){
							face[1]	+= 1;
						}
						if(banmoving<0){
							face[1]	-= 1;
						}
					}
				}else{
					showmsg("game over");
					stop();
					return false;
				}
			}
			if(next[0]<0){
				face[0]=-face[0];
			}
			if(next[1]>col-1||next[1]<0){
				face[1]=-face[1];
			}
			ballknock(next);
			hideball();
			pos=[pos[0]+face[0],pos[1]+face[1]];
			showball();
		}
		
		var addscore=function(zk_i){
			score=score+arrzk[zk_i][2];
			showmsg("+"+arrzk[zk_i][2]+"分");
			showscore();
		}
		
		var showmsg=function(msg){
			$("#msg").append("<a>"+msg+"</a>");
			$("#msg a:last").fadeIn("fast",function(){
				var ts = $(this);
				setTimeout(function(){ts.fadeOut(function(){ts.remove();})},500);
			});
			
		}
		
		var showscore=function(){
			$("#score").html(score);
		}
		
		var ballknock=function(next){
			var zk_i = inzk(next);			
			if(zk_i){
				var next1 = [pos[0],pos[1]+face[1]];
				var next2 = [pos[0]+face[0],pos[1]];
				var true1 = inzk(next1);
				var true2 = inzk(next2);
				if(true1){
					face[1]=-face[1];
					removezk(true1);
				}
				if(true2){
					face[0]=-face[0];
					removezk(true2);
				}
				if(!true1&&!true2){
					face[1]=-face[1];
					face[0]=-face[0];
					removezk(zk_i);
				}
			}
		}
		
		var inzk=function(arr){
			for(var i=0;i<arrzk.length;i++){
				if(!arrzk[i])continue;
				var a=arrzk[i];
				var x = a[0];
				var y = a[1];
				if(arr[0]>=x&&arr[0]<=x+1&&arr[1]>=y&&arr[1]<=y+2){
					return i;	
				}
			}
			return false;
			
		}
		
		var start=function(){
			stop();
			run = setInterval(moveball,speed);
		}
		
		var stop=function(){
			clearInterval(run);
		}
		
		var init = function(){
			drawtable();
			makezk();
			makeban();
			pos = [row-2,bany];
			showball();
		} 
		init();
		
		
		return{
			init:init,
			start:start,
			moveban:moveban,	
		}
		
	})($);
});