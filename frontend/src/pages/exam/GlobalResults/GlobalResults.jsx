import "./GlobalResults.css";

const GlobalResults = () => {
  return (
    <div className="frame-parent">
      <div className="pie-chart-parent">
        <div className="pie-chart">
          <div className="pie-chart-icon" />
          <div className="legend">
            <div className="legend-series">
              <div className="dot">
                <div className="color" />
              </div>
              <div className="series-1">20/20</div>
            </div>
            <div className="legend-series">
              <div className="dot">
                <div className="color1" />
              </div>
              <div className="series-1">10/20</div>
            </div>
            <div className="legend-series">
              <div className="dot">
                <div className="color1" />
              </div>
              <div className="series-1">4/20</div>
            </div>
            <div className="legend-series3">
              <div className="dot">
                <div className="color3" />
              </div>
              <div className="series-1">0</div>
            </div>
            <div className="legend-series">
              <div className="dot">
                <div className="color4" />
              </div>
              <div className="series-1">0/20</div>
            </div>
            <div className="legend-series3">
              <div className="dot">
                <div className="color5" />
              </div>
              <div className="series-1">Series 6</div>
            </div>
            <div className="legend-series3">
              <div className="dot">
                <div className="color6" />
              </div>
              <div className="series-1">Series 6</div>
            </div>
          </div>
        </div>
        <div className="dtail">
          <p className="bravo-pour-ta">Détail :</p>
        </div>
      </div>
      <div className="bravo-pour-ta-session-dc-parent">
        <div className="bravo-pour-ta-container">
          <p className="bravo-pour-ta">Bravo pour ta session ! ⚡️</p>
          <p className="dcouvre-la-correction">
            Découvre la correction détaillée :
          </p>
        </div>
        <div className="badge-parent">
          <div className="badge">
            <div className="text">DP 1</div>
          </div>
          <b className="text1">13,5/20</b>
        </div>
        <div className="badge-group">
          <div className="badge">
            <div className="text">DP 2</div>
          </div>
          <b className="text1">15/20</b>
        </div>
      </div>
      <div className="dp-score">
        <div className="badge2">
          <div className="text4">GLOBAL MARK</div>
        </div>
        <b className="text5">13,5/20</b>
      </div>
    </div>
  );
};

export default GlobalResults;
