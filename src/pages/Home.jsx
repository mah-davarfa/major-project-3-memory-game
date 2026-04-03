import GameSetup from "../components/GameSetup";
import Modal from "../components/Modal";
import { useState } from "react";

export default function Home() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isHowToPlayMadolOpened, setIsHowToPlayMadolOpened] = useState(false);

  return (
    <>
    <div className="home-page">
           <button
            onClick={()=> setIsAboutModalOpen(true)}>
              About Memory Game
            </button>
                {
                    isAboutModalOpen && (
                      <Modal
                      title="About Memory Game"
                      onClose={()=>{
                        setIsAboutModalOpen(false)
                      }}
                    >
                        <div className="page page-lower">
                            <p className="instructions-1">
                              This game improves cognitive performance by training:
                              <br />
                              1. Working memory<br />
                              2. Visual-spatial memory<br />
                              3. Selective attention<br />
                              4. Processing speed<br />
                              5. Error-based learning<br />
                              6. Motivation and engagement
                            </p>
                              
                        </div>
                    </Modal>
            )}
              <button
                onClick={()=> setIsHowToPlayMadolOpened(true)}
                >
              How to Play
            </button>
            {
                isHowToPlayMadolOpened && (
                  <Modal
                  onClose={()=>{
                      setIsHowToPlayMadolOpened(false)
                    }}
                    title={"How to Play Memory Game"}
                  ><div className=" page-lower">
                  <p className="instructions page">

                      When the game starts, all cards are face-up. Player gets a few
                      seconds to memorize positions. After the preview time ends, all
                      cards flip face-down. From this point on, the game begins.
                    </p>

                    <p>
                        Player clicks a card → it flips face-up.
                        <br />
                        Player clicks a second card → it flips face-up.
                        <br />
                        Game checks match.
                        <br />
                        If match → stays face-up.
                        <br />
                        If not match → auto flips back down.
                        <br />
                        Player needs to match all cards in the time they choose.
                        <br />
                        Easy = up to 6 mismatches, Medium = up to 4 mismatches, Hard = up
                        to 2 mismatches.
                    </p>
                  </div>

                  </Modal>)
            }
            
    </div>
            <GameSetup />
    
    </>


  );
}
