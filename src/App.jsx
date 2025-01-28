import { useState,useRef,useEffect } from 'react'
import './App.css'

function App() {
    const playgame = useRef(true);
    const road = useRef(null);
    const road2 = useRef(null);
    const gamebox = useRef(null);
    const boxtown = useRef(null);
    const arrtown = useRef([]);

    document.addEventListener("keydown",(event) => {
        if (event.key == " ") {
            if (playgame.current) {
                playgame.current = false
                let speedroad = 0;
                let speedroad2 = 0;
                let speedlevel = 1;
                let polleftgamebox = 0;
                let polrightroad = 0;
                let polrightroad2 = 0;

                if (road2.current) {
                    speedroad2 = road2.current.offsetWidth;
                    polleftgamebox = gamebox.current.getBoundingClientRect();
                }

                let time = setInterval(() => {
                    if (road.current) {
                        polrightroad = road.current.getBoundingClientRect();
                        polrightroad2 = road2.current.getBoundingClientRect();

                        if (polrightroad.right <= polleftgamebox.left) {
                            speedroad = road.current.offsetWidth - 5;
                        }

                        if (polrightroad2.right <= polleftgamebox.left) {
                            speedroad2 = road2.current.offsetWidth - 5;
                        }

                        road.current.style.left =  `${speedroad}px`;
                        road2.current.style.left =  `${speedroad2}px`;

                        arrtown.current.forEach((el,i) => {
                            let polright = el.e.getBoundingClientRect();

                            el.e.style.left = `${el.pol}px`;

                            if (polright.right < polleftgamebox.left) {
                                try{
                                    arrtown.current[i].splice(i,1);
                                    boxtown.current.children[i].remove();
                                    return
                                }
                                catch{}
                            }
                        });
                    }

                    speedroad -= speedlevel;
                    speedroad2 -= speedlevel;

                    arrtown.current.forEach(el => {
                        el.pol -= speedlevel;
                    });
                },0);

                let time2 = setInterval(() => {
                    const arrimg = ["./town2.png","./town3.png"];
                    let droplength = [];
                    let randomdroplength = Math.floor(Math.random() * 3);

                    if (gamebox.current) {
                        droplength = [gamebox.current.offsetWidth + 50,gamebox.current.offsetWidth + 80,gamebox.current.offsetWidth + 100];
                    }

                    const createimg = document.createElement("img");
                    createimg.src = arrimg[Math.floor(Math.random() * 2)];
                    createimg.style.position = "absolute";
                    createimg.style.left = droplength[randomdroplength] + "px";
                    createimg.style.bottom = "2px";

                    if (gamebox.current) {
                        boxtown.current.appendChild(createimg);
                        arrtown.current.push({e:createimg,pol:droplength[randomdroplength]});
                    }
                },1500);

                return () => clearInterval(time);
            }
            else {
                
            }
        }
    });

    return (
      <div ref={gamebox} className="boxgame">
          <img className="plane" src="./plane.png" alt="" />
          <img ref={road} className="road" src="./road.png" alt="" />
          <img ref={road2} className="road" src="./road.png" alt="" />
          <div ref={boxtown} className="boxtown"></div>
      </div>
    )
}

export default App;
