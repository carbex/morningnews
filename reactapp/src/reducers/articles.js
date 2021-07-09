export default function(articleWishlist = [], action) {
    if(action.type === 'addArticle') {
        var newArticleWishlist = [...articleWishlist]
        let alreadyExist = false
        
        articleWishlist.forEach((e) => {
            if(e && e.title === action.article.title) {
                alreadyExist = true
            }
        })
        
        if(!alreadyExist) {
            newArticleWishlist.push(action.article)
            return newArticleWishlist;
        } else {
            return articleWishlist;
        }
    } 
    else if(action.type === 'delArticle') {
        newArticleWishlist = [...articleWishlist]
        newArticleWishlist.splice(action.index, 1)
        return newArticleWishlist;
    } 
    else if(action.type === 'addWishList') {
        return action.wishList;
    } 
    else {
        return articleWishlist;
    }
  }