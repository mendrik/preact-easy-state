import {h} from 'preact'
import {View} from '../../decorators/view'
import {QuillComponent} from '../../util/quill-component'
import {HorizontalSplit} from '../../components/horizontal-split/horizontal-split'
import {ScrollPane} from '../../components/scroll-pane/scrollpane'

@View
export class MainPage extends QuillComponent {

    render() {
        return (
            <div class="application">
                <nav class="header"/>
                <ScrollPane className="app-content">
                    <HorizontalSplit>
                        <div>
                            Replica of an Allosaurus skeleton.<br/>
                            Aachenosaurus – a piece of petrified wood<br/>
                            Aardonyx<br/>
                            Abdallahsaurus – nomen nudum, probably Giraffatitan<br/>
                            Abelisaurus<br/>
                            Abrictosaurus<br/>
                            Abrosaurus<br/>
                            Abydosaurus<br/>
                            Acanthopholis<br/>
                            Achelousaurus<br/>
                            Acheroraptor<br/>
                            Achillesaurus<br/>
                            Achillobator<br/>
                            Acristavus<br/>
                            Acrocanthosaurus<br/>
                            Acrotholus<br/>
                            Actiosaurus – a choristoderan<br/>
                            Adamantisaurus<br/>
                            Adasaurus<br/>
                            Adelolophus<br/>
                            Adeopapposaurus<br/>
                            Aegyptosaurus<br/>
                            Aeolosaurus<br/>
                            Aepisaurus<br/>
                            Aepyornithomimus<br/>
                            Aerosteon<br/>
                            Aetonyx – possible junior synonym of Massospondylus<br/>
                            Afromimus<br/>
                            Afrovenator<br/>
                            Agathaumas - possible synonym of Triceratops<br/>
                            Aggiosaurus – a metriorhynchid crocodilian<br/>
                            Agilisaurus<br/>
                            Agnosphitys<br/>
                            Agrosaurus – probably a junior synonym of Thecodontosaurus<br/>
                            Agujaceratops<br/>
                            Agustinia<br/>
                            Ahshislepelta<br/>
                            Airakoraptor - nomen nudum<br/>
                            Ajancingenia - synonym of Heyuannia<br/>
                            Ajkaceratops<br/>
                            Alamosaurus<br/>
                            Alaskacephale<br/>
                            Albalophosaurus<br/>
                            Albertaceratops<br/>
                            Albertadromeus<br/>
                            Albertavenator<br/>
                            Albertonykus<br/>
                            Albertosaurus<br/>
                            Albinykus[1]<br/>
                            Albisaurus – a non-dinosaurian reptile<br/>
                            Alcovasaurus<br/>
                            Alectrosaurus<br/>
                            Aletopelta<br/>
                            Algoasaurus<br/>
                            Alioramus<br/>
                            Artist's reconstruction of Amargasaurus.<br/>
                            Aliwalia – junior synonym of Eucnemesaurus<br/>
                            Allosaurus<br/>
                            Almas<br/>
                            Alnashetri<br/>
                            Alocodon<br/>
                            Altirhinus<br/>
                            Altispinax<br/>
                            Alvarezsaurus<br/>
                            Alwalkeria<br/>
                            Alxasaurus<br/>
                            Amargasaurus<br/>
                            Amargastegos<br/>
                            Amargatitanis<br/>
                            Amazonsaurus<br/>
                            Ammosaurus - possible junior synonym of Anchisaurus<br/>
                            Ampelosaurus<br/>
                            Amphicoelias<br/>
                            Amphicoelicaudia – nomen nudum; possibly Huabeisaurus<br/>
                            Amphisaurus – preoccupied name, now known as Anchisaurus<br/>
                            Amtocephale<br/>
                            Amtosaurus – possibly Talarurus<br/>
                            Amurosaurus<br/>
                            Amygdalodon<br/>
                            Anabisetia<br/>
                            Anasazisaurus<br/>
                            Anatosaurus – junior synonym of Edmontosaurus<br/>
                            Anatotitan – junior synonym of Edmontosaurus<br/>
                            Anchiceratops<br/>
                            Anchiornis<br/>
                        </div>
                        <div>
                            Replica of an Allosaurus skeleton.<br/>
                            Aachenosaurus – a piece of petrified wood<br/>
                            Aardonyx<br/>
                            Abdallahsaurus – nomen nudum, probably Giraffatitan<br/>
                            Abelisaurus<br/>
                            Abrictosaurus<br/>
                            Abrosaurus<br/>
                            Abydosaurus<br/>
                            Acanthopholis<br/>
                            Achelousaurus<br/>
                            Acheroraptor<br/>
                            Achillesaurus<br/>
                            Achillobator<br/>
                            Acristavus<br/>
                            Acrocanthosaurus<br/>
                            Acrotholus<br/>
                            Actiosaurus – a choristoderan<br/>
                            Adamantisaurus<br/>
                            Adasaurus<br/>
                            Adelolophus<br/>
                            Adeopapposaurus<br/>
                            Aegyptosaurus<br/>
                            Aeolosaurus<br/>
                            Aepisaurus<br/>
                            Aepyornithomimus<br/>
                            Aerosteon<br/>
                            Aetonyx – possible junior synonym of Massospondylus<br/>
                            Afromimus<br/>
                            Afrovenator<br/>
                            Agathaumas - possible synonym of Triceratops<br/>
                            Aggiosaurus – a metriorhynchid crocodilian<br/>
                            Agilisaurus<br/>
                            Agnosphitys<br/>
                            Agrosaurus – probably a junior synonym of Thecodontosaurus<br/>
                            Agujaceratops<br/>
                            Agustinia<br/>
                            Ahshislepelta<br/>
                            Airakoraptor - nomen nudum<br/>
                            Ajancingenia - synonym of Heyuannia<br/>
                            Ajkaceratops<br/>
                            Alamosaurus<br/>
                            Alaskacephale<br/>
                            Albalophosaurus<br/>
                            Albertaceratops<br/>
                            Albertadromeus<br/>
                            Albertavenator<br/>
                            Albertonykus<br/>
                            Albertosaurus<br/>
                            Albinykus[1]<br/>
                            Albisaurus – a non-dinosaurian reptile<br/>
                            Alcovasaurus<br/>
                            Alectrosaurus<br/>
                            Aletopelta<br/>
                            Algoasaurus<br/>
                            Alioramus<br/>
                            Artist's reconstruction of Amargasaurus.<br/>
                            Aliwalia – junior synonym of Eucnemesaurus<br/>
                            Allosaurus<br/>
                            Almas<br/>
                            Alnashetri<br/>
                            Alocodon<br/>
                            Altirhinus<br/>
                            Altispinax<br/>
                            Alvarezsaurus<br/>
                            Alwalkeria<br/>
                            Alxasaurus<br/>
                            Amargasaurus<br/>
                            Amargastegos<br/>
                            Amargatitanis<br/>
                            Amazonsaurus<br/>
                            Ammosaurus - possible junior synonym of Anchisaurus<br/>
                            Ampelosaurus<br/>
                            Amphicoelias<br/>
                            Amphicoelicaudia – nomen nudum; possibly Huabeisaurus<br/>
                            Amphisaurus – preoccupied name, now known as Anchisaurus<br/>
                            Amtocephale<br/>
                            Amtosaurus – possibly Talarurus<br/>
                            Amurosaurus<br/>
                            Amygdalodon<br/>
                            Anabisetia<br/>
                            Anasazisaurus<br/>
                            Anatosaurus – junior synonym of Edmontosaurus<br/>
                            Anatotitan – junior synonym of Edmontosaurus<br/>
                            Anchiceratops<br/>
                            Anchiornis<br/>
                        </div>
                    </HorizontalSplit>
                </ScrollPane>
                <footer class="footer"/>
            </div>
        )
    }
}
