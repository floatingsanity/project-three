// import stuff
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.presenter = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      presenter: { type: String },
      description: {type: String},
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
      display:flex;
      flex-direction: column;
      
      }
      .wrapper {
      padding: 40px;
      background-color: #FFC0CB;
      margin-top: 16px;
      margin-bottom: 16px;
      border-radius: 30px; 
      border: 4px solid transparent;
}

    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
       <div>
      <div class="wrapper">
        <h3>${this.title}</h3>
        <h6>${this.presenter}</h6>
        <h6>${this.description}</h6>
        <slot></slot>
      </div> 
    </div>  
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
