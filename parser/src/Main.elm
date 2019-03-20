module Main exposing (main)

import Bipuuk
import Bipuuk.CircleRenderer
import Browser
import Html exposing (Html, div, h1, img, pre, text, textarea)
import Html.Attributes exposing (src, value)
import Html.Events exposing (onInput)



---- MODEL ----


type alias Model =
    { text : String
    , tree : Bipuuk.Tree
    , error : Maybe String
    }


init : ( Model, Cmd Msg )
init =
    ( { text = ""
      , tree = Bipuuk.empty
      , error = Nothing
      }
    , Cmd.none
    )



---- UPDATE ----


type Msg
    = NoOp
    | InputText String


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        InputText text ->
            ( case Bipuuk.fromString text of
                Ok tree ->
                    { model | text = text, tree = tree, error = Nothing }

                Err error ->
                    { model | text = text, error = Just error }
            , Cmd.none
            )



---- VIEW ----


view : Model -> Html Msg
view model =
    div []
        [ textarea [ value model.text, onInput InputText ] []
        , pre [] [ Bipuuk.toDigits model.tree |> text ]
        , pre [] [ Bipuuk.toDyckWord model.tree |> text ]
        , pre [] [ model.error |> Maybe.withDefault "" |> text ]
        , Bipuuk.CircleRenderer.renderCircle model.tree
        ]



---- PROGRAM ----


main : Program () Model Msg
main =
    Browser.element
        { view = view
        , init = \_ -> init
        , update = update
        , subscriptions = always Sub.none
        }
