import GameSetup from "../components/GameSetup";

export default function Home() {
  return (
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
      <GameSetup />
    </div>
  );
}
