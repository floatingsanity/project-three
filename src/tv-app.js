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
      metadata: {},
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
      timecode: { type: Number },
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
        align-items: center;
      }
      .container {
  display: flex;
  justify-content: space-between;
}
      .listings {
    width: 20%; 
    overflow-y: auto;
    max-height: 900px;
    border-radius: 10 px;
    background-color: #676767;
    border: 4px solid #000;
    padding: 30px; 
}
      .video-container {
        width: 60%;
        overflow: hidden; 
        background-color: #676767;
        border: 4px solid #000;
        padding: 30px; 
        border-radius: 30px;
      }
        sl-button {
          margin-right: 40px;
          border: 2px solid #000;
          border-radius: 10px;
          background-color: #FFC0CB;
          width:45%; 
        }

      .information {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 99%;
        height: 250px;
        font-size: 16px;
        background-color: #FFC0CB;
        border: 2px solid #000;
        border-radius: 30px;
        white-space: pre-line;
        margin-top: 20px;

        }
        tv-channel.clicked {
        border: 4px solid #E0115F;
        padding: 20px;
        box-sizing: border-box; 
        border-radius: 30px;
      }

      tv-channel:hover {
        cursor: pointer;
        color: #FFFFFF;

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
            <video-player id="video1" source="https://youtu.be/FWTNMzK9vG4?si=vEhlWYJyndP-ZZNi" accent-color="pink" >
            </video-player>
          </div>
          <!-- buttons -->
          <sl-button variant="neutral" outline @click="${() => this.showPrevious(this.activeItem)}">Previous</sl-button>
          <sl-button variant="neutral" outline @click="${() => this.showNext(this.activeItem)}">Next</sl-button>
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
                  class="${this.activeItem.id === item.id ? 'clicked' : ''}"
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
    const previouslyClickedItem = this.shadowRoot.querySelector('.clicked');
    if (previouslyClickedItem) {
      previouslyClickedItem.classList.remove('clicked');
    }
  
    e.target.classList.add('clicked');
  
    this.activeItem = {
      title: e.target.title,
      id: e.target.id,
      description: e.target.description,
      metadata: e.target.metadata,
    };
  
    this.updateVideoPlayer();
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
  
  showNext() {
    const currentIndex = this.listings.findIndex(item => item.id === this.activeItem.id);
    const nextIndex = (currentIndex + 1) % this.listings.length;
    this.activeItem = this.listings[nextIndex];
    this.updateVideoPlayer();
  }
  
  showPrevious() {
    const currentIndex = this.listings.findIndex(item => item.id === this.activeItem.id);
    const previousIndex = (currentIndex - 1 + this.listings.length) % this.listings.length;
    this.activeItem = this.listings[previousIndex];
    this.updateVideoPlayer();
    
  }

  updateVideoPlayer() {
    const videoPlayer = this.shadowRoot.querySelector('video-player');
    if (videoPlayer) {
      const a11yMediaPlayer = videoPlayer.shadowRoot.querySelector('a11y-media-player');
  
      if (a11yMediaPlayer) {
        // Set the video source based on the active item's metadata
        a11yMediaPlayer.source = this.activeItem.metadata.source;
  
        // Play the video
        a11yMediaPlayer.play();
  
        // Seek to a specific time (e.g., the time specified in metadata)
        a11yMediaPlayer.seek(this.activeItem.metadata.timecode);
      }
    }
  }

  updateActiveItem(index) {
    const previouslyClickedItem = this.shadowRoot.querySelector('.clicked');
    if (previouslyClickedItem) {
      previouslyClickedItem.classList.remove('clicked');
    }

    const newActiveItem = this.listings[index];
    const newActiveItemElement = this.shadowRoot.querySelector(`[id="${newActiveItem.id}"]`);
    
    if (newActiveItemElement) {
      newActiveItemElement.classList.add('clicked');
    }

    this.activeItem = newActiveItem;
    this.updateVideoPlayer();
  }
  
  connectedCallback() {
    super.connectedCallback();
    const videoPlayer = this.shadowRoot.querySelector('video-player');
    if (videoPlayer) {
      videoPlayer.addEventListener('timeupdate', this.handleVideoTimeUpdate.bind(this));
    }
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    const videoPlayer = this.shadowRoot.querySelector('video-player');
    if (videoPlayer) {
      videoPlayer.removeEventListener('timeupdate', this.handleVideoTimeUpdate.bind(this));
    }
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