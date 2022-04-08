import {Button, TimePicker} from "antd"

import moment from 'moment';

function onChange(time, timeString) {
  console.log(time, timeString);
}

function App() {
  return (
    <div>
        聚光灯
    </div>
  );
}

ReactDOM.render(<App />, mountNode);

