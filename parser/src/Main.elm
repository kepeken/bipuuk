module Main exposing (main)

import Browser
import Element
import Element.Font
import Element.Input
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
        []
        (Element.column
            [ Element.width Element.fill
            , Element.padding 10
            ]
            [ Element.Input.multiline
                [ Element.Font.family
                    [ Element.Font.monospace
                    ]
                ]
                { label = Element.Input.labelHidden "Input"
                , onChange = Input
                , placeholder =
                    Just
                        (Element.Input.placeholder
                            []
                            (Element.text "Input")
                        )
                , spellcheck = False
                , text = model.input
                }
            , Element.text model.input
            ]
        )
