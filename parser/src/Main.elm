module Main exposing (main)

import Bipuuk
import Browser
import Element
import Element.Background
import Element.Font
import Element.Input
import Element.Region
import Html exposing (Html)
import Html.Attributes
import Http


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = \_ -> Sub.none
        }



-- MODEL


type alias Model =
    { input : String
    , dictionary : Bipuuk.Dictionary
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { input = "", dictionary = Bipuuk.emptyDictionary }
    , Http.get { url = "dictionary.tsv", expect = Http.expectString GetDictionary }
    )



-- UPDATE


type Msg
    = ChangeText String
    | GetDictionary (Result Http.Error String)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeText input ->
            ( { model | input = input }, Cmd.none )

        GetDictionary responce ->
            case responce of
                Ok tsv ->
                    ( { model | dictionary = Bipuuk.loadDictionary tsv }, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )



-- VIEW


view : Model -> Html Msg
view model =
    Element.layout
        [ Element.Font.family
            [ Element.Font.typeface "SFMono-Regular"
            , Element.Font.typeface "Consolas"
            , Element.Font.typeface "Liberation Mono"
            , Element.Font.typeface "Menlo"
            , Element.Font.typeface "Courier"
            , Element.Font.monospace
            ]
        , Element.Background.color <| Element.rgb255 0xFC 0xFC 0xFA
        ]
    <|
        Element.column
            [ Element.width Element.fill
            , Element.padding 10
            , Element.spacing 10
            ]
            [ Element.el
                [ Element.Region.heading 1
                , Element.paddingXY 0 10
                , Element.Font.size 40
                , Element.Font.medium
                ]
              <|
                Element.text "Bipuuk Parser"
            , Element.el
                [ Element.width Element.fill
                , Element.htmlAttribute <| Html.Attributes.style "word-break" "break-all"
                ]
              <|
                Element.Input.multiline
                    []
                    { onChange = ChangeText
                    , text = model.input
                    , placeholder = Just <| Element.Input.placeholder [] <| Element.text "Input"
                    , label = Element.Input.labelHidden "Input"
                    , spellcheck = False
                    }
            , Element.column
                [ Element.spacing 4
                ]
              <|
                List.map Element.text <|
                    String.lines <|
                        case Bipuuk.parse model.input of
                            Ok tree ->
                                Bipuuk.inspect model.dictionary tree

                            Err error ->
                                error
            ]
