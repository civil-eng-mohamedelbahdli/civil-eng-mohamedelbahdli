var ProjectCardsPreview = createClass({
  render: function () {
    var items = this.props.entry.getIn(['data', 'projects']);
    var projects = (items && items.toJS ? items.toJS() : []).filter(function (project) {
      return project.visible !== false;
    });
    var categoryLabels = {
      structural: 'Structural Design',
      site: 'Site Execution',
      training: 'Training'
    };

    return h('main', { style: { background: '#0B1A2F', color: '#D7E1EE', minHeight: '100vh', padding: '24px', fontFamily: 'Arial, sans-serif' } },
      h('h2', { style: { color: '#E8A020', margin: '0 0 18px' } }, 'معاينة بطاقات المشاريع'),
      h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' } },
        projects.map(function (project) {
          var cover = project.coverImage || (project.images && project.images[0] && project.images[0].src);
          var image = cover && this.props.getAsset(cover);
          var descriptions = Array.isArray(project.description) ? project.description : [project.description];
          return h('article', { key: project.id || project.title, style: { background: '#10243F', border: '1px solid #263D5D', borderRadius: '12px', overflow: 'hidden' } },
            image ? h('img', { src: image.toString(), alt: project.title || '', style: { width: '100%', height: '180px', objectFit: 'cover' } }) : null,
            h('div', { style: { padding: '16px' } },
              h('div', { style: { color: '#E8A020', fontSize: '12px', textTransform: 'uppercase' } }, categoryLabels[project.category] || project.category || ''),
              h('h3', { style: { color: '#F3F6FA', fontSize: '19px', margin: '10px 0' } }, project.title || 'Project title'),
              descriptions.filter(Boolean).map(function (line, index) {
                return h('p', { key: index, style: { color: '#AAB9CC', fontSize: '14px', lineHeight: 1.5 } }, line);
              }),
              project.info ? ['location', 'date', 'role', 'projectType', 'scope'].filter(function (key) {
                return project.info[key];
              }).map(function (key) {
                var labels = { location: 'Location', date: 'Date', role: 'Role', projectType: 'Project type', scope: 'Scope' };
                return h('p', { key: key, style: { color: '#C5D2E1', fontSize: '13px' } }, labels[key] + ': ' + project.info[key]);
              }) : null
            )
          );
        }.bind(this))
      )
    );
  }
});

CMS.registerPreviewTemplate('projects', ProjectCardsPreview);
