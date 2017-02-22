# Example app

```javascript
// entry.js

import { Model } from '@adrianhelvik/api-toolkit'
import express from 'express'
import { Article } from './models'

Model.db = ‹...›; // TODO: Create better description

const app = express()

app.use(Article.resource('/articles'))

app.listen(3000)
```

```javascript
// models.js

import { Model } from '@adrianhelvik/api-toolkit'

export class Article extends Model {
  static table = 'article'
  static columns = ['id', 'title', 'content']
}
```

```javascript
// controllers.js
import { Controller } from '@adrianhelvik/api-toolkit'
import { Article } from './models'

class ArticleCtrl extends Controller {
  static model = Article
}
```
