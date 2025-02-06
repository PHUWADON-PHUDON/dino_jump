import { useState,useRef,useCallback, useEffect } from 'react'
import './App.css'

function App() {
    const [select,setselect] = useState("");
    const [countscore,setcountscore] = useState(0);
    const [counthiscore,setcounthiscore] = useState(0);
    const playgame = useRef(true);
    const plane = useRef(null);
    const road = useRef(null);
    const road2 = useRef(null);
    const gamebox = useRef(null);
    const boxtown = useRef(null);
    const arrtown = useRef([]);
    const death = useRef(false);
    const speedlevel = useRef(2);
    const checkdinoimg = useRef(false);
    const selectref = useRef("");
    const time1 = useRef(null);
    const time2 = useRef(null);
    const time3 = useRef(null);
    const time4 = useRef(null);

    document.addEventListener("keydown",(event) => {
        if (event.key == " ") {
            let speedroad = 0;
            let speedroad2 = 0;
            let polleftgamebox = 0;
            let polrightroad = 0;
            let polrightroad2 = 0;

            if (playgame.current) {
                playgame.current = false;

                if (road2.current) {
                    speedroad2 = road2.current.offsetWidth;
                    polleftgamebox = gamebox.current.getBoundingClientRect();
                }

                time1.current = setInterval(() => {
                    if (selectref.current == "./dino1.png") {
                        if (checkdinoimg.current) {
                            setselect("./dino1.png");
                            checkdinoimg.current = false;
                        }
                        else {
                            setselect("./dino2.png");
                            checkdinoimg.current = true;
                        }
                    }
                    
                    return () => clearInterval(time1.current);
                },100);

                time2.current = setInterval(() => {
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
                                arrtown.current.splice(i,1);
                                boxtown.current.children[i].remove();
                            }
                        });
                    }

                    speedroad -= speedlevel.current;
                    speedroad2 -= speedlevel.current;

                    arrtown.current.forEach(el => {
                        el.pol -= speedlevel.current;
                    });

                    arrtown.current.forEach(el => {
                        const polplane = plane.current.getBoundingClientRect();
                        const polarrtown = el.e.getBoundingClientRect();

                        if (polplane.top < polarrtown.bottom &&
                            polplane.bottom > polarrtown.top &&
                            polplane.left < polarrtown.right &&
                            polplane.right > polarrtown.left ||
                            polplane.top < polarrtown.bottom &&
                            polplane.bottom > polarrtown.top &&
                            polplane.left < polarrtown.right &&
                            polplane.right > polarrtown.left) {
                                death.current = true;
                                speedlevel.current = 0;
                                plane.current.classList.add("addanimationpause");
                                plane.current.classList.add("addanimationpausedino");
                                clearInterval(time1.current);
                                clearInterval(time2.current);
                                clearInterval(time3.current);
                                clearInterval(time4.current);
                                playgame.current = true;

                        }
                    });

                    return () => clearInterval(time2.current);
                },0);

                time3.current = setInterval(() => {
                    const arrimg = ["./town1.png","./town2.png","./town3.png"];
                    let droplength = [];
                    let randomdroplength = Math.floor(Math.random() * 3);

                    if (gamebox.current) {
                        droplength = [gamebox.current.offsetWidth + 50,gamebox.current.offsetWidth + 80,gamebox.current.offsetWidth + 100];
                    }

                    const createimg = document.createElement("img");
                    createimg.src = arrimg[Math.floor(Math.random() * 3)];
                    createimg.style.position = "absolute";
                    createimg.style.left = droplength[randomdroplength] + "px";
                    createimg.style.bottom = "2px";

                    if (gamebox.current) {
                        boxtown.current.appendChild(createimg);
                        arrtown.current.push({e:createimg,pol:droplength[randomdroplength]});
                    }

                    return () => clearInterval(time3.current);
                },1200);

                time4.current = setInterval(() => {
                    if (!death.current) {
                        setcountscore(prev => prev + 1);
                    }

                    return () => clearInterval(time4.current);
                },100);
            }
            else {
                if (plane.current) {
                    if (!death.current) {
                        if (selectref.current == "./dino1.png" || selectref.current == "./dino2.png") {
                            plane.current.classList.add("adddinoani");
                        }
                        else {
                            plane.current.classList.add("addplaneani");
                        }
                    }
                    else {
                        speedlevel.current = 2;
                        death.current = false;
                        arrtown.current = [];
                        plane.current.classList.remove("addplaneani");
                        plane.current.classList.remove("addanimationpause");
                        plane.current.classList.remove("adddinoani");
                        plane.current.classList.remove("addanimationpausedino");
                        boxtown.current.innerHTML = "";
                        setcountscore(prev => 0);
                    }
                }
            }
        }
    });

    const selectPlayer = (value) => {
        setselect(value);
        selectref.current = value

        if (plane.current) {
            if (value == "./dino1.png") {
                plane.current.style.bottom = "0";
            }
            else {
                plane.current.style.bottom = "55px";
            }
        }
    }

    const aniend = () => {
        if (plane.current) {
            plane.current.classList.remove("addplaneani");
            plane.current.classList.remove("adddinoani");
        }
    }

    useEffect(() => {
        if (countscore > 0) {
            if (countscore >= counthiscore) {
                setcounthiscore(prev => countscore);
            }
        }
    },[countscore]);

    const clickSelect = () => {
        setselect("");
        clearInterval(time1.current);
        clearInterval(time2.current);
        clearInterval(time3.current);
        clearInterval(time4.current);
        playgame.current = true;
    }

    return (
      <div ref={gamebox} className="boxgame">
        {select != "" ? 
            <button onClick={() => clickSelect()} className="selectbtn">SELECT</button>:""
        }
        {select != "" ? 
            <div className="displayscore">
                <h2 className="hiscore">HI {counthiscore}</h2>
                <h2 className="score">{countscore}</h2>
            </div>:""
        }
        {select == "" ? 
            <div className="select">
                <div onClick={() => selectPlayer("./plane.png")}>
                    <img src="./plane.png" alt="" />
                </div>
                <div onClick={() => selectPlayer("./dino1.png")}>
                    <img src="./dino1.png" alt="" />
                </div>
            </div>:""
        }
        <img ref={plane} onAnimationEnd={aniend} className="plane" src={select} alt="" />
        <img ref={road} className="road" src="./road.png" alt="" />
        <img ref={road2} className="road" src="./road.png" alt="" />
        <div ref={boxtown} className="boxtown"></div>
      </div>
    );
}

export default App;