import React, { useEffect } from "react";
import './TextSphere.css';

// Importing TagCloud package
import TagCloud from "TagCloud";

const TextShpere = () => {
  // Animation settings for Text Cloud
  useEffect(() => {
    return () => {
      const container = ".tagcloud";
      const texts = [
        "Community",
        "Quality",
        "Blockchain",
        "Transparancy",
        "DAO",
        "Organization",
        "Decentralization",
        "Democracy",
        "Content",
        "Reward",
        "Creation",
        "Earn",
        "Security",
      ];

      const options = {
        radius: 300,
        maxSpeed: "normal",
        initSpeed: "normal",
        keep: true,
      };

      TagCloud(container, texts, options);
    };
  }, []);

  return (
    <>
      <div className="text-shpere">
        {/* span tag className must be "tagcloud"  */}
        <span className="tagcloud"></span>
      </div>
    </>
  );
};

export default TextShpere;