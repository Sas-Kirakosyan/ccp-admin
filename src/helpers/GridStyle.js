class GridStyle {
  constructor() {
    if (GridStyle.instance === null) {
      this.gridStyles = { maxHeight: '460px', border: '1px solid #cfdbe2' };
      GridStyle.instance = this;
    }
    return GridStyle.instance;
  }

  setHeigth(h) {
    this.gridStyles = { ...this.getStyles, maxHeight: h };
  }

  getStyles() {
    return this.gridStyles;
  }
}

export default new GridStyle();
