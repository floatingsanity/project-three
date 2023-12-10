 // import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "./tv-channel.js";
import "@lrnwebcomponents/video-player/video-player.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.activeItem = {
      title: null,
      id: null,
      description: null,
    };
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object }
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display:block;
        margin: 16px;
        padding: 16px;
      }
      .container {
  display: flex;
  justify-content: space-between;
}
      .listings {
    width: 20%; 
}
      .video-container {
        width: 70%;
        overflow: hidden; 
      }
      sl-button {
        margin-right: 70px;
        padding: 20px;
        width:40%; 
      }
      .information {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90%;
        height: 250px;
        font-size: 16px;
        background-color: #FFC0CB;
        border: 1px solid #676767;
        white-space: pre-line;

        }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="container">
        <div class="video-container">
          <div>
            <!-- video -->
            <video-player id="video1" source="https://youtu.be/FWTNMzK9vG4?si=vEhlWYJyndP-ZZNi" accent-color="orange">
            </video-player>
          </div>
          <!-- buttons -->
          <sl-button variant="neutral" outline>Previous</sl-button>
          <sl-button variant="neutral" outline>Next</sl-button>
          <div class="information">
          ${this.activeItem.title}
            ${this.activeItem.description}
          </div>
          <!-- dialog -->
          <sl-dialog label="Dialog" class="dialog">
            ${this.activeItem.title}
            <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
          </sl-dialog>
        </div>
        <div class="listings">
          ${
            this.listings.map(
              (item) => html`
                <tv-channel
                  id="${item.id}"
                  title="${item.title}"
                  presenter="${item.metadata.author}"
                  description="${item.description}"
                  @click="${this.itemClick}"
                >
                </tv-channel>
              `
            )
          }
        </div>
      </div>
  
    <!-- dialog -->
    <sl-dialog label="Dialog" class="dialog">
      ${this.activeItem.title}
      <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
    </sl-dialog>
  </div>
</div>

    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    this.activeItem = {
      title: e.target.title,
      id: e.target.id,
      description: e.target.description,
    };
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
        console.log(this.listings);
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);