import BaseTheme from "../themes/base";

class ThemeManager{
  
  constructor(theme){
    this._current = BaseTheme;
    if(theme){
      this.mergeTheme(theme);
    }
  }

  current(){
    return this._current;
  }

  mergeTheme(theme){
    this._current = {...this._current, ...theme};
  }

}
//this.context.themeManager = new ThemeManager();
export default ThemeManager;
