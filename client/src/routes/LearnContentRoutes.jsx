import { Route } from "wouter";

export default function LearnContentRoutes({
  LearnHub,
  LearnGuides,
  LearnGuideDetail,
  LearnArticles,
  LearnArticleDetail,
  CourseCatalog,
}) {
  return (
    <>
      <Route path="/learn" component={LearnHub} />
      <Route path="/learn/guides" component={LearnGuides} />
      <Route path="/learn/guides/:slug" component={LearnGuideDetail} />
      <Route path="/learn/articles" component={LearnArticles} />
      <Route path="/learn/articles/:slug" component={LearnArticleDetail} />
      <Route path="/guides" component={LearnGuides} />
      <Route path="/articles" component={LearnArticles} />
      <Route path="/tutorials" component={LearnGuides} />
      <Route path="/lessons" component={LearnGuides} />
      <Route path="/training">{() => <CourseCatalog />}</Route>
      <Route path="/education" component={LearnHub} />
      <Route path="/workshop">{() => <CourseCatalog />}</Route>
      <Route path="/workshops">{() => <CourseCatalog />}</Route>
      <Route path="/library" component={LearnHub} />
    </>
  );
}
