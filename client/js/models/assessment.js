import $          from 'jquery';
import Utils      from '../utils/utils';
import EdX        from './edx';
import Qti        from './qti';

export default class Assessment{

  static parseAssessment(settings, data){
    var xml = $(data);
    var assessmentXml   = xml.find('assessment').addBack('assessment');
    var questestinterop = xml.find('questestinterop').addBack('questestinterop');
    var sequential      = xml.find('sequential').addBack('sequential');

    if(assessmentXml.length > 0 || questestinterop.length > 0){
      return this.parseQti(assessmentXml, xml);
    } else if(sequential.length > 0){
      return this.parseEdX(settings, sequential);
    } else {
      return {
        error: "Open Assessments could not find valid QTI or EdX XML. Nothing will be rendered. Please verify that your XML meets one of these standards."
      };
    }
  }

  static parseQti(assessmentXml, xml){
    var assessment = {
      id         : assessmentXml.attr('ident'),
      title      : assessmentXml.attr('title'),
      standard   : 'qti'
    };
    assessment.objectives = xml.find('assessment > objectives matref').map((index, item) => {
      return $(item).attr('linkrefid');
    });
    assessment.sections = Qti.parseSections(xml);
    return assessment;
  }

  static parseEdX(settings, sequential){
    var url = settings.srcUrl;
    var id  = url.slice(url.indexOf('sequential')).replace('.xml', '');
    var assessment = {
      id       : id,
      title    : sequential.attr('display_name'),
      standard : 'edX'
    };

    var baseUrl = url.substr(0, url.indexOf('sequential'));

    var seqentialChildren = sequential.children();
    EdX.ensureIds('edx_sequential_', seqentialChildren);
    EdX.padArray(this.get('sections'), seqentialChildren);
    
    var promises = EdX.crawlEdX(sequential.children(), baseUrl + 'vertical/', function(id, url, data){
      var section = EdXSection.fromEdX(id, url, data);

      EdX.findAndSetObject(this.get('sections'), section);

      var children = section.get('xml').children();
      EdX.ensureIds('edx_item_', children);
      EdX.padArray(section.get('items'), children);
      var sectionPromises = EdX.crawlEdX(children, baseUrl + 'problem/', function(id, url, data){
        var item = EdXItem.fromEdX(id, url, data);
        if(item){
          EdX.findAndSetObject(section.get('items'), item);
        }
      }.bind(this));
      if(promises){
        Ember.RSVP.Promise.all(promises.concat(sectionPromises)).then(function(){
          this.trigger('loaded');
        }.bind(this));
      } else {
        this.trigger('loaded');
      }
    }.bind(this));
  }

}
