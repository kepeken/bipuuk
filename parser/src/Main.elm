module Main exposing (main)

import Bipuuk
import Browser
import Element
import Element.Background
import Element.Font
import Element.Input
import Element.Region
import Html exposing (Html)


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
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model ""
    , Cmd.none
    )



-- UPDATE


type Msg
    = NoOp
    | Input String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        Input input ->
            ( { model | input = input }, Cmd.none )



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
            ]
            [ Element.el
                [ Element.Region.heading 1
                , Element.paddingXY 0 10
                , Element.Font.size 40
                , Element.Font.medium
                ]
              <|
                Element.text "Bipuuk Parser"
            , Element.Input.multiline
                []
                { label = Element.Input.labelHidden "Input"
                , onChange = Input
                , placeholder = Just <| Element.Input.placeholder [] <| Element.text "Input"
                , spellcheck = False
                , text = model.input
                }
            , Element.text <|
                case Bipuuk.parse model.input of
                    Ok tree ->
                        Bipuuk.toDyckWord tree

                    Err error ->
                        error
            ]
