import React from "react";
import CSSTransition from "react-transition-group/CSSTransition";

export default function TransitionerPage(Page) {
  return (props) => (
    <CSSTransition in={true} appear={true} timeout={600} classNames="fade">
      <Page {...props} />
    </CSSTransition>
  );
}
