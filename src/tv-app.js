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
    this.transitionInProgress = false;
    this.clickTimeout = null;
    this.addEventListener('timeupdate', this.handleVideoTimeUpdate.bind(this));
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
    width: 25%; 
    overflow-y: auto ;
    max-height: 900px;
    border-radius: 10px;
    background-color: #676767;
    border: 4px solid #000;
    padding: 30px; 
    margin-left: 5%;
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
            <video-player 
        dark track="https://haxtheweb.org/files/HAXshort.vtt"
        id="video1" 
        source="https://youtu.be/FWTNMzK9vG4?si=vEhlWYJyndP-ZZNi" 
        accent-color="pink" 
        @timeupdate="${this.handleVideoTimeUpdate}" >
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
                  image="${item.image}"
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
    const clickedItem = this.listings.find(item => item.id === e.target.id);

    if (clickedItem) {
      this.updateActiveItem(clickedItem);
    }
  }

  handleManualItemClick(item) {
    if (!this.transitionInProgress && !this.buttonActionInProgress) {
      this.buttonActionInProgress = true;
      this.transitionInProgress = true;

      this.updateActiveItem(item);

  
      setTimeout(() => {
        this.transitionInProgress = false;
        this.buttonActionInProgress = false;
      }, 500); 
    }
  }

  async showNext() {
    await this.handleManualItemClick(this.listings[(this.listings.findIndex(item => item.id === this.activeItem.id) + 1) % this.listings.length]);
  }
    async showPrevious() {
    await this.handleManualItemClick(this.listings[(this.listings.findIndex(item => item.id === this.activeItem.id) - 1 + this.listings.length) % this.listings.length]);
  }


  handleTransitionEnd() {
    this.transitionInProgress = false;
  }
  handleVideoTimeUpdate(e) {
    if (!this.transitionInProgress) {
      this.updateActiveItemByTime();
    }
  }
  
  seekToCurrentTime() {
    const videoPlayer = this.shadowRoot.querySelector('video-player');
    if (videoPlayer) {
      const a11yMediaPlayer = videoPlayer.shadowRoot.querySelector('a11y-media-player');

      if (a11yMediaPlayer) {
        a11yMediaPlayer.seek(this.activeItem.metadata.timecode, this.activeItem.metadata.end_time);
      }
    }
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

  updateVideoPlayer() {
    const videoPlayer = this.shadowRoot.querySelector('video-player');
    if (videoPlayer) {
      const a11yMediaPlayer = videoPlayer.shadowRoot.querySelector('a11y-media-player');

      if (a11yMediaPlayer) {
        a11yMediaPlayer.source = this.activeItem.metadata.source;

        a11yMediaPlayer.play();

        a11yMediaPlayer.seek(this.activeItem.metadata.timecode, this.activeItem.metadata.end_time);
      }
    }
  }
  
  updateActiveItem(newActiveItem) {
    const previouslyClickedItem = this.shadowRoot.querySelector('.clicked');
    if (previouslyClickedItem) {
      previouslyClickedItem.classList.remove('clicked');
    }

    const newActiveItemElement = this.shadowRoot.querySelector(`[id="${newActiveItem.id}"]`);
    if (newActiveItemElement) {
      newActiveItemElement.classList.add('clicked');
    }
    this.activeItem = {
      title: newActiveItem.title,
      id: newActiveItem.id,
      description: newActiveItem.description,
      metadata: newActiveItem.metadata,
    };

    this.timecode = newActiveItem.metadata.timecode; 
    this.updateVideoPlayer();
  }
  updateActiveItemByTime() {
    const currentTime = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").media.currentTime;
  
    const itemId = (
      (currentTime >= 0 && currentTime < 43 && 'item-1') ||
      (currentTime >= 43 && currentTime < 71 && 'item-2') ||
      (currentTime >= 71 && currentTime < 92 && 'item-3') ||
      (currentTime >= 92 && currentTime < 114 && 'item-4') ||
      (currentTime >= 114 && currentTime < 140 && 'item-5') ||
      (currentTime >= 140 && currentTime < 175 && 'item-6') ||
      (currentTime >= 175 && currentTime < 259 && 'item-7') ||
      (currentTime >= 259 && currentTime < 318 && 'item-8') ||
      (currentTime >= 318 && currentTime < 346 && 'item-9')
    );
  
    if (itemId) {
      if (this.activeItem && itemId === this.activeItem.id) {
        return; 
      }
  
      const clickedItem = this.listings.find(item => item.id === itemId);
  
      if (clickedItem) {
        const previouslyClickedItem = this.shadowRoot.querySelector('.clicked');
        if (previouslyClickedItem) {
          previouslyClickedItem.classList.remove('clicked');
        }
        const newActiveItemElement = this.shadowRoot.querySelector(`[id="${clickedItem.id}"]`);
        if (newActiveItemElement) {
          newActiveItemElement.classList.add('clicked');
        }
  
        this.activeItem = {
          title: clickedItem.title,
          id: clickedItem.id,
          description: clickedItem.description,
          metadata: clickedItem.metadata,
        };
  
        this.timecode = clickedItem.metadata.timecode; 
  
        this.updateVideoPlayer();
      }
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