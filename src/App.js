import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  border: none;
  background-color: #f5c91c;
  font-weight: bold;
  width: 250px;
  font-size: 40px;
  height: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  border: none;
  background-color: #f5c91c;
  font-weight: bold;
  font-size: 80px;
  width: 300px;
  height: 130px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width:28px; 
  height:28px;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click mint to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    TWITTER_LINK: "",
    SHOW_BACKGROUND: false,
  });
  const crawlFull = useRef(false);

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();

    //STYLING STAR WARS SCRIPTS
    const canvas = document.getElementById("canvas");
    const c = canvas.getContext("2d");

    let w;
    let h;

    const setCanvasExtents = () => {
      w = document.body.clientWidth;
      h = document.body.clientHeight;
      canvas.width = Math.min(1600, w);
      canvas.height = Math.min(900, h);
    };

    setCanvasExtents();

    const crawl = document.getElementById("crawl");
    const crawlContent = document.getElementById("crawl-content");
    const crawlContentStyle = crawlContent.style;

    // start crawl at bottom of 3d plane
    let crawlPos = crawl.clientHeight;

    const makeStars = (count) => {
      const out = [];
      for (let i = 0; i < count; i++) {
        const s = {
          x: Math.random() * 1600 - 800,
          y: Math.random() * 900 - 450,
          z: Math.random() * 1000,
        };
        out.push(s);
      }
      return out;
    };

    let stars = makeStars(2000);

    window.onresize = () => {
      setCanvasExtents();
    };

    const clear = () => {
      c.fillStyle = "black";
      c.fillRect(0, 0, canvas.width, canvas.height);
    };

    const putPixel = (x, y, brightness) => {
      const intensity = brightness * 255;
      const rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
      c.fillStyle = rgb;
      c.fillRect(x, y, 1, 1);
    };

    const moveStars = (distance) => {
      const count = stars.length;
      for (var i = 0; i < count; i++) {
        const s = stars[i];
        s.z -= distance;
        if (s.z <= 1) {
          s.z += 999;
        }
      }
    };

    const moveCrawl = (distance) => {
      if (crawlFull.current == false) {
        crawlPos -= distance;
        crawlContentStyle.top = crawlPos + "px";

        // if we've scrolled all content past the top edge
        // of the plane, reposition content at bottom of plane
        if (crawlPos <= 200.9488000000003) {
          crawlFull.current = true;
        }
        if (crawlPos < -crawlContent.clientHeight) {
          crawlPos = crawl.clientHeight;
        }
      }
    };

    const paintStars = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const count = stars.length;
      for (var i = 0; i < count; i++) {
        const star = stars[i];

        const x = cx + star.x / (star.z * 0.001);
        const y = cy + star.y / (star.z * 0.001);

        if (x < 0 || x >= w || y < 0 || y >= h) {
          continue;
        }

        const d = star.z / 1000.0;
        const b = 1 - d * d;

        putPixel(x, y, b);
      }
    };

    let prevTime;
    const init = (time) => {
      prevTime = time;
      requestAnimationFrame(tick);
    };

    const tick = (time) => {
      let elapsed = time - prevTime;
      prevTime = time;

      moveStars(elapsed * 0.02);

      // time-scale of crawl, increase factor to go faster
      moveCrawl(elapsed * 0.5);

      clear();
      paintStars();

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(init);
  }, [blockchain.account]);

  return (
    // <s.Screen>
    //   <s.Container flex={1} ai={"center"}>
    //     <a href={CONFIG.MARKETPLACE_LINK}>
    //       {/* <StyledLogo alt={"logo"} src={"/config/images/logo.png"} /> */}
    //     </a>
    //     <s.TextTitle
    //       style={{
    //         textAlign: "center",
    //         fontSize: 50,
    //         fontWeight: "bold",
    //         color: "var(--accent-text)",
    //       }}
    //     >
    //       Star Punks NFT
    //     </s.TextTitle>
    //     <s.SpacerSmall />
    //     <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
    //       <s.SpacerLarge />
    //       <s.Container flex={2} jc={"center"} ai={"center"}>
    //         <s.TextTitle
    //           style={{
    //             textAlign: "center",
    //             fontSize: 50,
    //             fontWeight: "bold",
    //             color: "var(--accent-text)",
    //           }}
    //         >
    //           {data.totalSupply} / {CONFIG.MAX_SUPPLY}
    //         </s.TextTitle>
    //         {/* <s.TextDescription
    //           style={{
    //             textAlign: "center",
    //             color: "var(--primary-text)",
    //           }}
    //         >
    //           <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
    //             {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
    //           </StyledLink>
    //         </s.TextDescription> */}
    //         <span
    //           style={{
    //             textAlign: "center",
    //           }}
    //         >
    //           {/* <StyledButton
    //             onClick={(e) => {
    //               window.open("/config/roadmap.pdf", "_blank");
    //             }}
    //             style={{
    //               margin: "5px",
    //             }}
    //           >
    //             Roadmap
    //           </StyledButton> */}
    //           <StyledButton
    //             style={{
    //               margin: "5px",
    //             }}
    //             onClick={(e) => {
    //               window.open(CONFIG.MARKETPLACE_LINK, "_blank");
    //             }}
    //           >
    //             {CONFIG.MARKETPLACE}
    //           </StyledButton>
    //         </span>
    //         <s.SpacerSmall />
    //         {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
    //           <>
    //             <s.TextTitle
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               The sale has ended.
    //             </s.TextTitle>
    //             <s.TextDescription
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               You can still find {CONFIG.NFT_NAME} on
    //             </s.TextDescription>
    //             <s.SpacerSmall />
    //             <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
    //               {CONFIG.MARKETPLACE}
    //             </StyledLink>
    //           </>
    //         ) : (
    //           <>
    //             <s.TextTitle
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               {CONFIG.DISPLAY_COST}{" "}
    //               {CONFIG.NETWORK.SYMBOL}.
    //             </s.TextTitle>
    //             <s.SpacerXSmall />
    //             {/* <s.TextDescription
    //               style={{ textAlign: "center", color: "var(--accent-text)" }}
    //             >
    //               Excluding gas fees.
    //             </s.TextDescription>
    //             <s.SpacerSmall /> */}
    //             {blockchain.account === "" ||
    //             blockchain.smartContract === null ? (
    //               <s.Container ai={"center"} jc={"center"}>
    //                 {/* <s.TextDescription
    //                   style={{
    //                     textAlign: "center",
    //                     color: "var(--accent-text)",
    //                   }}
    //                 >
    //                   Connect to the {CONFIG.NETWORK.NAME} network
    //                 </s.TextDescription> */}
    //                 <s.SpacerSmall />
    //                 <StyledButton
    //                   onClick={(e) => {
    //                     e.preventDefault();
    //                     dispatch(connect());
    //                     getData();
    //                   }}
    //                 >
    //                   CONNECT
    //                 </StyledButton>
    //                 {blockchain.errorMsg !== "" ? (
    //                   <>
    //                     <s.SpacerSmall />
    //                     <s.TextDescription
    //                       style={{
    //                         textAlign: "center",
    //                         color: "var(--accent-text)",
    //                       }}
    //                     >
    //                       {blockchain.errorMsg}
    //                     </s.TextDescription>
    //                   </>
    //                 ) : null}
    //               </s.Container>
    //             ) : (
    //               <>
    //                 <s.TextDescription
    //                   style={{
    //                     textAlign: "center",
    //                     color: "var(--accent-text)",
    //                   }}
    //                 >
    //                   {feedback}
    //                 </s.TextDescription>
    //                 <s.SpacerMedium />
    //                 <s.Container ai={"center"} jc={"center"} fd={"row"}>
    //                   <StyledRoundButton
    //                     style={{ lineHeight: 0.4 }}
    //                     disabled={claimingNft ? 1 : 0}
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       decrementMintAmount();
    //                     }}
    //                   >
    //                     -
    //                   </StyledRoundButton>
    //                   <s.SpacerMedium />
    //                   <s.TextDescription
    //                     style={{
    //                       textAlign: "center",
    //                       color: "var(--accent-text)",
    //                     }}
    //                   >
    //                     {mintAmount}
    //                   </s.TextDescription>
    //                   <s.SpacerMedium />
    //                   <StyledRoundButton
    //                     disabled={claimingNft ? 1 : 0}
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       incrementMintAmount();
    //                     }}
    //                   >
    //                     +
    //                   </StyledRoundButton>
    //                 </s.Container>
    //                 <s.SpacerSmall />
    //                 <s.Container ai={"center"} jc={"center"} fd={"row"}>
    //                   <StyledButton
    //                     disabled={claimingNft ? 1 : 0}
    //                     onClick={(e) => {
    //                       e.preventDefault();
    //                       claimNFTs();
    //                       getData();
    //                     }}
    //                   >
    //                     {claimingNft ? "BUSY" : "BUY"}
    //                   </StyledButton>
    //                 </s.Container>
    //               </>
    //             )}
    //           </>
    //         )}
    //         <s.SpacerMedium />
    //       </s.Container>
    //       <s.SpacerLarge />
    //     </ResponsiveWrapper>
    //     <s.SpacerMedium />
    //     {/* <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
    //       <s.TextDescription
    //         style={{
    //           textAlign: "center",
    //           color: "var(--primary-text)",
    //         }}
    //       >
    //         Please make sure you are connected to the right network (
    //         {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
    //         Once you make the purchase, you cannot undo this action.
    //       </s.TextDescription>
    //       <s.SpacerSmall />
    //       <s.TextDescription
    //         style={{
    //           textAlign: "center",
    //           color: "var(--primary-text)",
    //         }}
    //       >
    //         We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
    //         successfully mint your NFT. We recommend that you don't lower the
    //         gas limit.
    //       </s.TextDescription>
    //     </s.Container> */}
    //   </s.Container>
    // </s.Screen>

    <body>
      <div class="topnav">
   <a href={CONFIG.TWITTER_LINK}>
   <StyledLogo alt={"logo"} src={"/config/images/twitter-logo.svg"} />
   </a>
   <a href={CONFIG.MARKETPLACE_LINK}>
   <StyledLogo alt={"logo"} src={"/config/images/opensea-logo.svg"} />
   </a>
</div>
      <canvas id="canvas" class="stretch"></canvas>
      <div id="crawl-container" class="stretch">
        <div id="crawl">
          <div id="crawl-content">
            <h1>STAR PUNKS NFT</h1>
            <p>
              <s.Container flex={1} ai={"center"}>
                <s.Container flex={2} jc={"center"} ai={"center"}>
                  <s.TextTitle
                    style={{
                      textAlign: "center",
                      fontSize: 100,
                      fontWeight: "bold",
                      color: "var(--accent-text)",
                    }}
                  >
                    {data.totalSupply} / {CONFIG.MAX_SUPPLY}
                  </s.TextTitle>
                  {/* <span
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <StyledButton
                        style={{
                          margin: "5px",
                        }}
                        onClick={(e) => {
                          window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                        }}
                      >
                        {CONFIG.MARKETPLACE}
                      </StyledButton>
                    </span> */}
                  {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                    <>
                      <s.TextTitle
                        style={{
                          fontSize: 100,
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        The sale has ended.
                      </s.TextTitle>
                      <s.TextDescription
                        style={{
                          fontSize: 100,
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        You can still find {CONFIG.NFT_NAME} on
                      </s.TextDescription>
                      <StyledButton
                        style={{
                          margin: "5px",
                        }}
                        onClick={(e) => {
                          window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                        }}
                      >
                        {CONFIG.MARKETPLACE}
                      </StyledButton>
                    </>
                  ) : (
                    <>
                      <s.TextTitle
                        style={{
                          fontSize: 100,
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {CONFIG.DISPLAY_COST} {CONFIG.NETWORK.SYMBOL}.
                      </s.TextTitle>
                      {blockchain.account === "" ||
                      blockchain.smartContract === null ? (
                        <s.Container ai={"center"} jc={"center"}>
                          <s.SpacerSmall />
                          <StyledButton
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(connect());
                              getData();
                            }}
                          >
                            CONNECT
                          </StyledButton>
                          {blockchain.errorMsg !== "" ? (
                            <>
                              <s.SpacerSmall />
                              <s.TextDescription
                                style={{
                                  textAlign: "center",
                                  color: "var(--accent-text)",
                                }}
                              >
                                {blockchain.errorMsg}
                              </s.TextDescription>
                            </>
                          ) : null}
                        </s.Container>
                      ) : (
                        <>
                          <s.TextDescription
                            style={{
                              fontSize: 25,
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {feedback}
                          </s.TextDescription>
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledRoundButton
                              style={{ lineHeight: 0.4 }}
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                decrementMintAmount();
                              }}
                            >
                              -
                            </StyledRoundButton>
                            <s.TextDescription
                              style={{
                                fontSize: 25,
                                textAlign: "center",
                                color: "var(--accent-text)",
                              }}
                            >
                              {mintAmount}
                            </s.TextDescription>
                            <StyledRoundButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                incrementMintAmount();
                              }}
                            >
                              +
                            </StyledRoundButton>
                          </s.Container>
                          <s.Container ai={"center"} jc={"center"} fd={"row"}>
                            <StyledButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                claimNFTs();
                                getData();
                              }}
                            >
                              {claimingNft ? "BUSY" : "MINT"}
                            </StyledButton>
                          </s.Container>
                        </>
                      )}
                    </>
                  )}
                </s.Container>
              </s.Container>
            </p>
          </div>
        </div>
      </div>
    </body>
  );
}

export default App;
