import SplitterLayout from 'react-splitter-layout';

function P2SplitterLayout(props) {
  return (
    <SplitterLayout {...props} customClassName={`p2-splitter-layout ${props.className || ""}`}>
      {props.children}
    </SplitterLayout>
  );
} 

export default P2SplitterLayout;
