import { html } from 'lit';
import '../src/project-three.js';

export default {
  title: 'ProjectThree',
  component: 'project-three',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <project-three
      style="--project-three-background-color: ${backgroundColor || 'white'}"
      .header=${header}
    >
    </project-three>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
