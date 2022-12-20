// create sheet objects from sheet values for easy operations
class SheetObject {
  /**
   * convert sheet row objects into values
   * @param {Object[]} data - row objects
   * @return {string[][]} 
   */
  static makeValues ({ data }) {
    // derive the headers from the data
    const headers = Object.keys(data.reduce((accumulator, rowObj) => {
      // iterate over row objects to ensure all header keys
      Object.keys(rowObj).forEach(col => accumulator[col] = col);
      return accumulator;
    }, {}));

    // combine the headers and the values
    return [headers].concat(data.map(rowObj => headers.map(col => rowObj[col])));
  }

  /**
   * convert sheet row values into objects
   * @param {string[][]} values - row values
   * @return {Object[]}
   */
  static makeData ({ values }) {
    const [headers, ...data] = values;
    return {
      headers,
      data: data.map(rowVals => headers.reduce((accumulator, col, i) => {
        // key: column header, value: cell value
        accumulator[col] = rowVals[i];
        return accumulator;
      },{})),
    };
  }

  constructor ({ mySheet }) {
    this._mySheet = mySheet;
    this.readValues();
  }

  // convert data to values and store
  setValues ({ data }) {
    this.values =  this.constructor.makeValues({ data: data || this.data });
  }

  set values (values) {
    this._values = values;
  }

  get values () {
    return this._values;
  }

  set headers (headers) {
    this._headers = headers;
  }
  
  get headers () {
    return this._headers;
  }

  // convert values to data and store
  setData ({ values }) {
    const { headers, data } = this.constructor.makeData({ values: values || this.values });
    this.headers = headers;
    this.data = data;
    return this.data;
  }

  set data (data) {
    this._data = data;
  }

  get data () {
    return this._data;
  }

  get mySheet () {
    return this._mySheet;
  }

  /**
   * write row objects to sheet
   * @param {Object} options
   * @param {Object[]} [options.data]
   */
  writeData (options) {
    // convert data to values and write to sheet
    const data = (options && options.data) || this.data;
    this.setValues({ data });
    this.writeValues();
  }

  /**
   * write row values to sheet
   * @param {Object} options
   * @param {string[][]} [options.values]
   */
  writeValues (options) {
    const values = (options && options.values) || this.values;
    this.mySheet.setValues({ values });
  }

  readValues () {
    this.values = this.mySheet.getValues();
    this.setData ({ values: this.values });
    return this.values;
  }
}
